/* eslint-disable no-console */
const express = require('express');
const cookieParser = require('cookie-parser');
// const sessions = require('express-session');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// Import routes
const authRoute = require('./routes/auth');
const administratorsRoute = require('./routes/administrators');
const userRoute = require('./routes/users');
const storeRoute = require('./routes/stores');
const storeUsersRoute = require('./routes/storeUsers');
const postRoute = require('./routes/posts');
const notificationRoute = require('./routes/notifications');
const mediaRoute = require('./routes/media');
const healthStarRoute = require('./routes/healthstars');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URL,
  () => console.log('💾 Connected to DB'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Route middleware
app.use('/api/auth', authRoute);
app.use('/api/administrators', administratorsRoute);
app.use('/api/users', userRoute);
app.use('/api/stores', storeRoute);
app.use('/api/storeUsers', storeUsersRoute);
app.use('/api/posts', postRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/media', mediaRoute);
app.use('/api/healthstars', healthStarRoute);

app.listen(3008, () => console.log(`🏎  API Server up and running at ${process.env.SERVER_URL}`));
