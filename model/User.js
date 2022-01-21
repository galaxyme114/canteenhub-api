const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'store', 'group', 'school', 'customer'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'declined', 'deleted', ''],
    default: '',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  ability: {
    type: Object,
  },
  companyName: {
    type: String,
  },
  address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: false,
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }],
  parentVendor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }],
  lastLogin: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);
