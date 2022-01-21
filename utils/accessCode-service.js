/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid');

const { AccessCode, AccessCodeKinds } = require('../model/AccessCode');

const CODE_LENGTH = 12;

/**
 * @typedef {Object} AccessCodeInput
 * @property {'PasswordReset'}  kind
 * @property {String}           resourceId
 * @property {String}           resourceType
 */

/**
 * creates a new AccessCode
 *
 * @param   {AccessCodeInput}  params
 *
 * @return  {Promise<AccessCode>}
 */
const createAccessCode = async (params) => {
  const code = nanoid(CODE_LENGTH);

  return AccessCode.create({
    ...params,
    code,
  });
};

/**
 * find Access Code by it's code property
 *
 * @param   {String}  code
 *
 * @return  {Promise<AccessCode>}
 */
const findAccessCode = async (code) => {
  const accessCode = await AccessCode.findOne({ code }).populate('resourceReference');

  // exit if does not exist
  if (!accessCode) {
    return false;
  }

  // check if redeemed
  if (accessCode.redeemedAt) {
    return false;
  }

  // check if expired
  if (new Date() > new Date(accessCode.expiresAt)) {
    return false;
  }

  return accessCode && !accessCode.redeemedAt ? accessCode : null;
};

/**
 * find Access Code by it's resource
 *
 * @param   {String}  resourceName
 * @param   {String}  resourceId
 * @param   {Object}  options
 * @param   {AccessCodeKinds} options.kind
 *
 * @return  {Promise<AccessCode>}
 */
const findAccessCodeByResource = async (resourceName, resourceId, options = {}) => {
  const params = {
    resourceName,
    resourceReference: resourceId,
    ...options,
  };
  const accessCode = await AccessCode.findOne(params).populate('resourceReference');

  if (accessCode.redeemedAt) {
    throw new Error('AccessCodeAlreadyRedeemed');
  }

  return accessCode;
};

/**
 * redeemes Access Code
 *
 * @param   {String}  code
 *
 * @return  {Promise<AccessCode>}
 */
const redeemAccessCode = async (code) => {
  const accessCode = await AccessCode.findOne({ code });

  if (accessCode.redeemedAt) {
    throw new Error('AccessCodeAlreadyRedeemed');
  }

  if (new Date() > new Date(accessCode.expiresAt)) {
    throw new Error('AccessCodeAlreadyExpired');
  }

  accessCode.redeemedAt = new Date();

  await accessCode.save();

  return accessCode;
};

/**
 * expires an access code
 *
 * @param   {AccessCode}  accessCode
 *
 * @return  {Promise<AccessCode>}
 */
const expireAccessCode = async (accessCode) => {
  if (accessCode.redeemedAt) {
    throw new Error('AccessCodeAlreadyRedeemed');
  }

  accessCode.expiresAt = new Date();

  await accessCode.save();

  return accessCode;
};

/**
 * Verifies user's email address by redeeming the access code
 *
 * @param   {import('../access-codes/access-code.entity')['AccessCode']}  accessCode
 *
 * @return  {Promise<Boolean | Errors>}
 */
const verifyEmail = async (accessCode) => {
  const { kind, resourceReference: user } = accessCode;

  if (kind !== AccessCodeKinds.EmailVerification) {
    throw new Error('IncorrectAccessCodeForEmailVerification', { kind });
  }
  if (!user) {
    throw new Error('UserNotFound');
  }

  user.emailVerified = true;
  await user.save();
  await redeemAccessCode(accessCode.code);

  return true;
};

module.exports = {
  createAccessCode,
  findAccessCode,
  findAccessCodeByResource,
  redeemAccessCode,
  expireAccessCode,
  verifyEmail,
};
