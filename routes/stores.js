const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');

// ** Models
const User = require('../model/User');
const Store = require('../model/Store');
const Address = require('../model/Address');

// ** utils
const { canVendorAccessStore } = require('../utils/utils');

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

// ** SendGrid
// const sendEmail = require('../utils/sendGrid/sendEmail');
// const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

const { formatGoogleAddress } = require('../utils/utils');
const { storeValidation } = require('../utils/validation');

// ** Get Stores
router.get('/', verifyUser(['admin', 'vendor']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Vendor does not exist'); }

  // Get the parent vendor ID (if admin, then this must be provided)
  const parentVendor = (reqUser.role === 'admin' ? req.params.parentVendor : res.user._id);

  const vendorFilter = { vendor: ObjectId(parentVendor) };
  const statusFilter = { status: { $ne: 'deleted' } };
  // const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== '' ? { status: req.query.status } : {};
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { storeName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      vendorFilter,
      statusFilter,
    ],
  };
  const totalCount = await Store.countDocuments({
    $and: [
      vendorFilter,
      statusFilter,
    ],
  });

  // const stores = await Store.find(filterParams).select('-__v');
  const stores = await Store.aggregate(
    [
      {
        $match: filterParams,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'storeUsers',
          foreignField: '_id',
          as: 'storeUsers',
        },
      },
      {
        $project: {
          'storeUsers.password': 0.0,
          'storeUsers.ability': 0.0,
        },
      },
    ],
    {
      allowDiskUse: false,
    },
  );

  return res.send({
    totalCount,
    filteredCount: stores.length,
    results: stores,
  });
});

// ** Get Store
router.get('/:id', verifyUser(['admin', 'vendor']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Vendor does not exist'); }

  let matchClause;
  if (reqUser.role === 'admin') {
    matchClause = { _id: ObjectId(req.params.id) };
  } else {
    matchClause = { _id: ObjectId(req.params.id), vendor: ObjectId(res.user._id.toString()) };
  }

  const store = await Store.aggregate(
    [
      {
        $match: matchClause,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'storeUsers',
          foreignField: '_id',
          as: 'storeUsers',
        },
      },
      {
        $project: {
          'storeUsers.password': 0.0,
          'storeUsers.ability': 0.0,
        },
      },
    ],
    {
      allowDiskUse: false,
    },
  );

  if (!store) {
    return res.status(400).send('User not found or you do not have permission to view');
  }
  return res.send(store);
});

// ** Create Store
router.post('/create', verifyUser(['admin', 'vendor']), async (req, res) => {
  // const checkRole =  verifyUser(['admin', 'vendor']);
  const storeData = req.body;
  // validate request

  const { error } = storeValidation(storeData);
  if (error) { return res.status(400).send(error.details[0].message); }

  const store = new Store({
    ...storeData,
  });
  // console.log('storeData:', storeData);
  try {
    const savedStore = await store.save();

    // Save the address
    const { addressObj } = req.body;
    let savedAddress;
    if (addressObj) {
      const address = new Address(formatGoogleAddress(addressObj));
      savedAddress = await address.save();
      if (savedAddress) {
        await savedStore.updateOne({
          $push: {
            storeAddress: {
              _id: savedAddress._id,
            },
          },
        });
      }
    }

    return res.send({ store: savedStore, message: 'Store successfully created' });
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

// ** Update Stores
router.patch('/update/:id', verifyUser(['admin', 'vendor']), async (req, res) => {
  const updateValues = req.body;

  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canVendorAccessStore(res.user._id, req.params.id);
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot delete this user');
  }
  const savedStore = await Store.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ user: savedStore, message: 'Store successfully updated' });
});

module.exports = router;
