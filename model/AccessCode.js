const mongoose = require('mongoose');

const AccessCodeKinds = {
  PasswordReset: 'PasswordReset',
  EmailVerification: 'EmailVerification',
};

const AccessCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  kind: {
    type: String,
    enum: Object.values(AccessCodeKinds),
    required: true,
  },
  resourceReference: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    // `refPath` means Mongoose will look at the `resourceName` property to find the right model.
    refPath: 'resourceName',
  },
  resourceName: {
    type: String,
    required: false,
    enum: ['User'],
  },
  redeemedAt: {
    type: Date,
    required: false,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: false,
    default: null,
  },
});

const AccessCode = mongoose.model('AccessCode', AccessCodeSchema);

module.exports = { AccessCodeSchema, AccessCodeKinds, AccessCode };
