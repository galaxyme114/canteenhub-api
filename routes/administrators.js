const router = require('express').Router();
const bcrypt = require('bcrypt');
const verifyUser = require('../utils/verifyToken');

const { generateResetPasswordURL, generateRandomString } = require('../utils/utils');

const {
  registerValidation,
} = require('../utils/validation');

const User = require('../model/User');

const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

const saltLength = 10;

// Create Administrator
// Endpoint: Register Users
router.post('/create', verifyUser(['admin']), async (req, res) => {
  const userData = req.body;

  if (!userData.password) {
    userData.password = await generateRandomString();
  }

  // validate request
  const { error } = registerValidation(userData);
  // console.log(userData, error);
  if (error) { return res.status(400).send(error.details[0].message); }

  // check for unique user
  const emailExists = await User.findOne({ email: userData.email });
  if (emailExists) { return res.status(400).send('Email already exists'); }

  // Hash the password
  const salt = await bcrypt.genSalt(saltLength);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashPassword,
    role: userData.role,
    ability: userData.ability,
  });

  try {
    const savedUser = await user.save();
    // remove password
    delete savedUser._doc.password;

    // Gererate reset password link and email to admin
    const resetPasswordURL = await generateResetPasswordURL(savedUser._id);

    emailTemplates.adminCreated.dynamic_template_data.btn_url = resetPasswordURL;
    await sendEmail(
      [user.email],
      {
        ...emailTemplates.adminCreated,
      },
    );

    return res.send({ user: savedUser, message: 'Adminstrator successfully registered' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
