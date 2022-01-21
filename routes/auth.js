/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const Address = require('../model/Address');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} = require('../utils/validation');
const {
  // createAccessCode,
  findAccessCode,
  redeemAccessCode,
  verifyEmail,
  // expireAccessCode,
} = require('../utils/accessCode-service');

const { formatGoogleAddress, generateResetPasswordURL, generateVerifyEmailURL } = require('../utils/utils');
// const verifyUser = require('../utils/verifyToken');

const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

const saltLength = 10;
// eslint-disable-next-line prefer-const
let refreshTokens = [];

const authConfig = {
  expireTime: '1d',
  refreshTokenExpireTime: '1d', // this will be the timeout for the user
};

// Endpoint: Register Users
router.post('/register', async (req, res) => {
  // console.log(req.body);
  // validate request
  const { error } = registerValidation(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  // do not allow admin to be registered here
  if (req.body.role === 'admin') {
    return res.status(403).send('Administrators cannot be registered using this endpoint');
  }

  // check for unique user
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) { return res.status(400).send('Email already exists'); }

  // hash the password
  const salt = await bcrypt.genSalt(saltLength);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
    status: req.body.status ? req.body.status : '',
    ability: req.body.ability,
    companyName: req.body.companyName,
  });

  // create an access token
  const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });

  try {
    const savedUser = await user.save();

    const { addressObj } = req.body;
    let savedAddress;
    if (addressObj) {
      const address = new Address(formatGoogleAddress(addressObj));
      savedAddress = await address.save();
      if (savedAddress) {
        await savedUser.updateOne({
          $push: {
            address: {
              _id: savedAddress._id,
            },
          },
        });
      }
    }

    // remove password
    delete savedUser._doc.password;

    // send verification email to new user
    const verifyEmailURL = await generateVerifyEmailURL(savedUser._id);
    emailTemplates.userRegistered.dynamic_template_data.btn_url = verifyEmailURL;
    await sendEmail(
      [user.email],
      {
        ...emailTemplates.userRegistered,
      },
    );

    // send notification to admin
    // emailTemplates.notificationUserRegistered.dynamic_template_data.subject = `New user registration: [${req.body.role}]`;
    const userUrl = `${process.env.FRONTEND_URL}/users/vendors/edit/${savedUser._id}`;
    emailTemplates.notificationUserRegistered.html = `New user registration details:<br />Name: ${req.body.firstName} ${req.body.lastName}<br />role: ${req.body.lastName}<br />email: ${req.body.email}<br /><a href="${userUrl}">Click here to preview and approve profile</a>`;
    await sendEmail(
      [process.env.EMAIL_ADMIN],
      {
        ...emailTemplates.notificationUserRegistered,
      },
    );

    res.send({ user: savedUser, accessToken, message: 'User successfully registered' });
  } catch (err) {
    res.status(400).send(err);
  }

  return false;
});

// Endpoint: Login user
router.post('/login', async (req, res) => {
  // validate request
  const { error } = loginValidation(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  const user = await User.findOneAndUpdate({ email: req.body.email }, { lastLogin: new Date() }).select('-__v');
  if (!user) { return res.status(400).send('Email provided is not a registered account'); }

  // do not allow users that are declined or deleted to login
  if (user.status === 'declined' || user.status === 'deleted') {
    return res.status(400).send('Account has been removed or is no longer active');
  }

  const tokenExpiry = req.body.remember ? '60d' : authConfig.expireTime;
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Email or password not found!');

  // validation passed, create tokens
  const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenExpiry });
  const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
  refreshTokens.push(refreshToken);

  // remove password
  delete user._doc.password;

  const userData = user;
  const response = {
    userData,
    accessToken,
  };
  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
    httpOnly: true,
  });
  return res.send(response);
});

// Endpoint: Refresh Token

router.post('/refreshToken/', async (req, res) => {
  // mock.onPost('/jwt/refresh-token').reply(request => {
  const { refreshToken } = req.cookies;
  try {
    const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // get user
    const userData = await User.findById(_id).select('-__v -password');
    if (!userData) { return res.status(400).send('Refreshing token, user not found'); }

    const newAccessToken = jwt.sign({ _id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
    const newRefreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });

    //   delete userData.password;
    const response = {
      userData,
      accessToken: newAccessToken,
    };
    res.cookie('refreshToken', newRefreshToken, {
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
      httpOnly: true,
    });
    return res.send(response);
  } catch (e) {
    // const error = 'Invalid or expired refresh token';
    return res.status(401).send(e);
  }
});

// Endpoint: Forgot password
router.post('/forgotPassword', async (req, res) => {
  // validate request
  const { error } = forgotPasswordValidation(req.body);
  if (error) { return res.status(400).send(error.details[0].message); }

  const user = await User.findOne({ email: req.body.email }).select('-__v');
  if (!user) { return res.status(400).send('Email provided is not found'); }

  const resetPasswordURL = await generateResetPasswordURL(user._id);

  // Send email
  emailTemplates.forgotPassword.dynamic_template_data.btn_url = resetPasswordURL;
  await sendEmail(
    [user.email],
    {
      ...emailTemplates.forgotPassword,
    },
  );

  return res.send('Email sent');
});

// Endpoint: Reset password
router.post('/resetPassword', async (req, res) => {
  if (!req.body.code) {
    return res.status(400).send('Error: access code is mandatory');
  }

  // Double check access code (just in case)
  const accessCode = await findAccessCode(req.body.code);
  if (!accessCode) {
    return res.status(400).send('Error: access code not found or already used');
  }

  // eslint-disable-next-line no-unused-vars
  const { kind, resourceReference: user } = accessCode;
  if (!user) {
    return res.status(400).send('Error: user not found');
  }

  // update user password
  const salt = await bcrypt.genSalt(saltLength);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();

  // Redeem access code
  await redeemAccessCode(accessCode.code);

  return res.send('Password reset');
});

// Endpoint: Access Code Find
router.get('/accessCode/find/:code', async (req, res) => {
  const { code } = req.params;
  const accessCode = await findAccessCode(code);

  if (!accessCode) {
    return res.status(400).send(false);
  }

  return res.send(accessCode.code);
});

// Endpoint: Verify Email
router.get('/verifyEmail/:code', async (req, res) => {
  const { code } = req.params;

  const accessCode = await findAccessCode(code);
  if (!accessCode) {
    return res.status(400).send(false);
  }

  try {
    await verifyEmail(accessCode);
    // return res.send(response);
  } catch (e) {
    // const error = 'Invalid or expired refresh token';
    // eslint-disable-next-line no-console
    console.log(e);
    return res.status(400).send(e);
  }
  return res.send(accessCode.code);
});

// Endpoint: Logout user (only used for sever side logout)
// router.post('/logout', verifyUser(), (req, res) => {
//   const { refreshToken } = req.body;

//   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//   res.clearCookie('refreshToken')
//   return res.send('You logged out successfully');
//   // req.session.destroy();
//   // res.redirect('/');
// });

module.exports = router;
