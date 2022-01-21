require('dotenv').config();

const templateIds = {
  defaultTemplate: 'd-769b7eac2ef44a4eacc11f4d1ba56ee5',
  adminNotification: 'd-6f31626de28e4343a6faf68271bdb04b',
};

const emailTemplates = {
  forgotPassword: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Request to reset your password',
      email_title: 'Forgot your password?',
      email_text: 'No worries - it happens. Simply click the button below to choose a new password.',
      btn_text: 'Reset password',
      btn_url: '/reset-password/',
    },
  },
  userRegistered: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Thank you for joining, please verify your email',
      email_title: 'Thank you for joining Canteen Hub',
      email_text: 'Please verify your email address in order to use our platform',
      btn_text: 'Verify Email',
      btn_url: '/verify-email/',
    },
  },
  resendVerifyEmail: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Email verification',
      email_title: 'Please verify your email',
      email_text: 'Click the button below to verify your email',
      btn_text: 'Verify Email',
      btn_url: '/verify-email/',
    },
  },
  userApproved: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Your account has been approved',
      email_title: 'Your account has been approved',
      email_text: 'You can now login to Canteen Hub and use all functionality',
      btn_text: 'Login',
      btn_url: `${process.env.FRONTEND_URL}`,
    },
  },
  userDeclined: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Your account has been declined',
      email_title: 'Unfortunately, your account has been declined',
      email_text: 'If you feel this is incorrect or in error, please contact us',
      btn_text: 'Contact Us',
      btn_url: `${process.env.FRONTEND_URL}/contact`,
    },
  },
  notificationUserRegistered: {
    template_id: '',
    subject: 'New user registration',
    dynamic_template_data: {},
  },
  adminCreated: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Your account is ready to use',
      email_title: 'Your Canteen Hub administrator account has been created',
      email_text: 'Please ensure you set your password by clicking the button below',
      btn_text: 'Set my password',
      btn_url: '/reset-password/',
    },
  },
  storeUserCreated: {
    template_id: templateIds.defaultTemplate,
    subject: '',
    dynamic_template_data: {
      subject: 'Your store user account has been created',
      email_title: 'Your Canteen Hub store user account has been created for [store_name]',
      email_text: 'Get started by creating a password to login to your account',
      btn_text: 'Get started',
      btn_url: '/reset-password/',
    },
  },
};

module.exports = {
  emailTemplates,
};
