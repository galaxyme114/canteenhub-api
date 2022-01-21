const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
    status: Joi.string(),
    companyName: Joi.string(),
    ability: Joi.array(),
    stores: Joi.array(),
    parentVendor: Joi.string(),
    addressObj: Joi.object(),
  });

  return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    remember: Joi.boolean(),
  });

  return schema.validate(data);
};

// Forgot Password Validation
const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

// Store Validation
const storeValidation = (data) => {
  const schema = Joi.object({
    vendor: Joi.string().required(),
    storeName: Joi.string().required(),
    storeEmail: Joi.string().email().required(),
    storePhone: Joi.string().required(),
    addressObj: Joi.object(),
    storeUsers: Joi.array(),
    storeLogo: Joi.any(),
    // status: Joi.string(),
    // companyName: Joi.string(),

    // stores: Joi.array(),
    // parentVendor: Joi.string(),
    //
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.storeValidation = storeValidation;
