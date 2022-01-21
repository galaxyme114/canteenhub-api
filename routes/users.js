const router = require('express').Router();
const mongoose = require('mongoose');
const verifyUser = require('../utils/verifyToken');

const User = require('../model/User');

const { canVendorAccessUser } = require('../utils/utils');

const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// Get User(s) (Admin Only)
router.get('/:id?', verifyUser(['admin']), async (req, res) => {
  // if looking for a single user - find and return
  if (req.params.id) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Malformed user id');
    }

    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(400).send('user not found');
    }
    return res.send(user);
  }

  const roleFilter = typeof req.query.role !== 'undefined' && req.query.role !== '' ? { role: req.query.role } : {};
  const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== '' ? { status: req.query.status } : {};
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { companyName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      roleFilter,
      statusFilter,
    ],
  };

  const totalCount = await User.countDocuments({});

  // console.log(req.);
  const users = await User.find(filterParams).select('-password -__v');
  return res.send({
    totalCount,
    filteredCount: users.length,
    results: users,
  });
});

// Get My Profile
router.get('/user/me', verifyUser(['admin', 'vendor', 'group', 'store', 'school', 'customer']), async (req, res) => {
  const user = await User.findById(res.user._id).select('-password -__v');
  return res.send(user);
});

// Update User(s)
router.patch('/update/:id', verifyUser(['admin', 'vendor']), async (req, res) => {
  const updateValues = req.body;

  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canVendorAccessUser(res.user._id, req.params.id);
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot delete this user');
  }

  const savedUser = await User.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ user: savedUser, message: 'User successfully updated' });
});

// Approve User(s)
router.patch('/approve/:id', verifyUser(['admin']), async (req, res) => {
  const approvedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'active' }, {
    new: true,
  });

  // send email
  await sendEmail(
    [approvedUser.email],
    {
      ...emailTemplates.userApproved,
    },
  );

  return res.send({ user: approvedUser, message: 'User successfully updated' });
});

// Decline User(s)
router.patch('/decline/:id', verifyUser(['admin']), async (req, res) => {
  // const declinedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'declined', ability: {} }, {
  const declinedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'declined' }, {
    new: true,
  });

  // send verification email to new user
  await sendEmail(
    [declinedUser.email],
    {
      ...emailTemplates.userDeclined,
    },
  );

  return res.send({ user: declinedUser, message: 'User successfully updated' });
});

// Delete User(s)
router.delete('/delete/:id', verifyUser(['admin', 'vendor']), async (req, res) => {
  // don't allow to delete self
  if (res.user._id === req.params.id) {
    return res.status(400).send('Cannot delete self');
  }

  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canVendorAccessUser(res.user._id, req.params.id);
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot delete this user');
  }

  // delete user
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.send('user deleted');
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
