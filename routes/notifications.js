/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
const router = require('express').Router();
const User = require('../model/User');

const verifyUser = require('../utils/verifyToken');
const { generateVerifyEmailURL } = require('../utils/utils');
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// Endpoint: Send Email
router.post('/verifyEmail', verifyUser(), async (req, res) => {
  // TODO: limit these requests for each user?
  // validate request
  const user = await User.findById(req.body.userId).select('email emailVerified');
  if (!user) {
    return res.status(400).send('user not found');
  }

  const verifyEmailURL = await generateVerifyEmailURL(req.body.userId);
  emailTemplates.resendVerifyEmail.dynamic_template_data.btn_url = verifyEmailURL;
  const emailRes = await sendEmail(
    [user.email],
    {
      ...emailTemplates.resendVerifyEmail,
    },
  );

  return res.send(emailRes);
});

module.exports = router;
