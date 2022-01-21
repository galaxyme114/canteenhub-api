const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  formattedAddress: {
    type: String,
    required: true,
  },
  streetNumber: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  political: {
    type: String,
    required: true,
  },
  administrativeAreaLevel2: {
    type: String,
  },
  administrativeAreaLevel1: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'au',
    required: true,
  },
  lat: {
    type: String,
  },
  lng: {
    type: String,
  },
});

module.exports = mongoose.model('Address', addressSchema);
