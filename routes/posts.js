const router = require('express').Router();
const verifyUser = require('../utils/verifyToken');

router.get('/', verifyUser, (req, res) => {
  res.json({ posts: { title: 'my first post', description: 'dnjekrnfkjernk' } });
});
module.exports = router;
