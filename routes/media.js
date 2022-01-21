const router = require('express').Router();
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const multer = require('multer'); // multer will be used to handle the form data.
const Aws = require('aws-sdk'); // aws-sdk library will used to upload image to s3 bucket.
// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');

// ** Models
// const Media = require('../model/Media');
// const User = require('../model/User');
// const Store = require('../model/Store');

const storage = multer.memoryStorage({
  destination(req, file, cb) {
    cb(null, '');
  },
});

// below variable is define to check the type of file which is uploaded
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(new Error('goes wrong on the mimetype!'), false);
  }
};

// defining the upload variable for the configuration of photo being uploaded
const upload = multer(
  {
    storage,
    fileFilter: filefilter,
  },
);

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET, // secretAccessKey is also store in .env file
});

// ** Upload Media Item
router.post('/upload', verifyUser(['admin', 'vendor']), upload.single('mediaFile'), async (req, res) => {
  const mediaRequest = req.body;

  // Definning the params variable to uplaod the photo
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier
    Key: `${mediaRequest.resourceType}/${mediaRequest.resourceObjId}/${req.file.originalname}`, // Name of the image
    Body: req.file.buffer, // Body which will contain the image in buffer format
    ACL: 'public-read', // defining the permissions to get the public link
    ContentType: req.file.mimetype, // Necessary to define the image content-type to view the photo in the browser with the link
  };

  // uplaoding the photo using s3 instance and saving the link in the database.
  s3.upload(params, async (error, data) => {
    if (error) {
      return res.status(500).send({ err: error }); // if we get any error while uploading error message will be returned.
    }

    // If not then below code will be executed
    // const media = new Media({
    //   resourceReference: mediaRequest.resourceObjId,
    //   resourceName: mediaRequest.resourceType,
    //   url: data.Location, // returned from s3 upload
    // });
    try {
      // const savedMedia = await media.save();

      // finally update resource
      const referenceModel = mongoose.model(mediaRequest.resourceType);
      await referenceModel.findByIdAndUpdate(mediaRequest.resourceObjId, { [mediaRequest.resourceField]: data.Location }, {
        new: true,
      });

      return res.send({ media: data.Location, message: 'Media successfully uploaded' });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  });
});

module.exports = router;
