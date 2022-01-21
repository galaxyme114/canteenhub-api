/* eslint-disable camelcase */
const sgMail = require('@sendgrid/mail');

/**
 * Sends an email using SendGrid templates
 *
 */
const sendEmail = (recipients, params) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // eslint-disable-next-line camelcase
  const { template_id, subject, dynamic_template_data } = params;

  const html_content = params.html ? params.html : ''; // (used only when there is no template)

  let data = {};
  if (template_id !== '') {
    data = {
      template_id,
      to: recipients, // Change to your recipient
      from: { name: process.env.EMAIL_FROM_NAME, email: process.env.EMAIL_FROM }, // Change to your verified sender
      subject,
      // html: 'dnejkfnejkrfnkejr',
      dynamic_template_data,
    };
  } else {
    data = {
      to: recipients,
      from: { name: process.env.EMAIL_FROM_NAME, email: process.env.EMAIL_FROM }, // Change to your verified sender
      subject,
      text: html_content,
      html: html_content,
    };
  }

  // console.log('params', params);
  // console.log('data', data);

  const sendEmailResponse = sgMail.send(data, (error, result) => {
    if (typeof error === 'undefined') {
      return (error);
    }
    return (result);
  });
  return sendEmailResponse;
};

module.exports = sendEmail;
