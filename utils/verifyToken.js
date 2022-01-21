/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = (usergroupsAllowed) => async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) return res.status(403).send('Access denied. Please check your API token');
    try {
      const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
      res.user = verified;

      const user = await User.findOne({ _id: res.user._id }).select('role');
      res.user.role = user.role;
      if ((usergroupsAllowed) && (!usergroupsAllowed.includes(user.role))) {
        return res.status(403).send('You do not have permission to run this request');
      }
      next();
    } catch (err) {
      res.status(401).send('Invalid or expired auth token');
    }
  } else {
    return res.status(401).json('Malformed or unauthenticated auth token');
  }
};
