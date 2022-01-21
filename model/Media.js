const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  resourceReference: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    // `refPath` means Mongoose will look at the `resourceName` property to find the right model.
    refPath: 'resourceName',
  },
  resourceName: {
    type: String,
    required: false,
    enum: ['User', 'Store'], // these are models where we can attach media
  },
  url: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('Media', mediaSchema);
