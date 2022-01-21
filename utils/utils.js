/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const crypto = require('crypto');
const {
  createAccessCode,
} = require('./accessCode-service');

// ** models
const User = require('../model/User');
const Store = require('../model/Store');

const convertToCamelCase = (str) => {
  const arr = str.match(/[a-z]+|\d+/gi);
  return arr.map((m, i) => {
    let low = m.toLowerCase();
    if (i !== 0) {
      low = low.split('').map((s, k) => (k === 0 ? s.toUpperCase() : s)).join``;
    }
    return low;
  }).join``;
};

const formatGoogleAddress = (addressObj) => {
  const address = addressObj.address_components.reduce((seed, { short_name, types }) => {
    types.forEach((t) => {
      const fieldName = convertToCamelCase(t);
      seed[fieldName] = short_name;
    });
    return seed;
  }, {});
  address.formattedAddress = addressObj.formatted_address;
  address.lat = addressObj.geometry.location.lat;
  address.lng = addressObj.geometry.location.lng;
  return address;
};

const generateResetPasswordURL = async (userObjId) => {
  const accessCode = await createAccessCode({
    resourceReference: userObjId,
    resourceName: 'User',
    kind: 'PasswordReset',
    expiresAt: new Date(Date.now() + 2 * (60 * 60 * 1000)), // 2 hour expiry
  });
  return `${process.env.FRONTEND_URL}/reset-password/${accessCode.code}`;
};

const generateVerifyEmailURL = async (userObjId) => {
  const accessCode = await createAccessCode({
    resourceReference: userObjId,
    resourceName: 'User',
    kind: 'EmailVerification',
    expiresAt: new Date(Date.now() + 24 * (60 * 60 * 1000)), // 24 hour expiry
  });
  return `${process.env.FRONTEND_URL}/verify-email/${accessCode.code}`;
};

// create random password (if not provided)
const generateRandomString = async () => {
  const generatePassword = (
    length = 10,
    wishlist = '0123456789abcdefghijklmnopqrstuvwxyz',
  ) => Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

  return (generatePassword());
};

// ** can vendor access user?
// returns Boolean
const canVendorAccessUser = async (vendorObjId, userObjId) => {
  const reqUser = await User.findById(vendorObjId).select('role');
  if (!reqUser) { return false; }
  // 1. First check vendor is a vendor
  // console.log('vendorObjId', vendorObjId);
  // console.log('userObjId', userObjId);
  if (reqUser.role === 'admin') {
    return true;
  }
  if (reqUser.role === 'vendor') {
    const user = await User.findOne({ _id: userObjId, parentVendor: ObjectId(vendorObjId.toString()) }).select('_id');
    return (!!user);
  }
  return (false);
};

// ** can vendor access store?
// returns Store if true
const canVendorAccessStore = async (vendorObjId, storeObjId) => {
  const storeFound = await Store.findOne({ _id: storeObjId, vendor: vendorObjId });
  if (!storeFound) { return false; }
  return storeFound;
};

module.exports = {
  convertToCamelCase,
  formatGoogleAddress,
  generateResetPasswordURL,
  generateRandomString,
  generateVerifyEmailURL,
  canVendorAccessUser,
  canVendorAccessStore,
};
