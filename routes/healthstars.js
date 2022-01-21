/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-sparse-arrays */
const router = require('express').Router();

const hsrCategory = [
  [],
  [, '1D - Dairy beverages', 6, -2, 8, 8.999, 'Beverages', 1],
  [, '2 - Foods', 29, -15, 44, 9.999, 'Food', 2],
  [, '2D - Dairy foods', 14, -3, 17, 9.999, 'Food', 2],
  [, '3 - Fats, oils', 45, 10, 35, 9.999, 'Fats/Oils/Cheese', 3],
  [, '3D - Cheese', 41, 23, 18, 9.999, 'Fats/Oils/Cheese', 3],
];

const karori_one = [
  [],
  [, 0, 0, 0, 0, 0],
  [, 335.01, 1.01, 5.01, 90.01, 1],
  [, 670.01, 2.01, 8.91, 180.01, 2],
  [, 1005.01, 3.01, 12.81, 270.01, 3],
  [, 1340.01, 4.01, 16.81, 360.01, 4],
  [, 1675.01, 5.01, 20.71, 450.01, 5],
  [, 2010.01, 6.01, 24.61, 540.01, 6],
  [, 2345.01, 7.01, 28.51, 630.01, 7],
  [, 2680.01, 8.01, 32.41, 720.01, 8],
  [, 3015.01, 9.01, 36.31, 810.01, 9],
  [, 3350.01, 10.01, 40.31, 900.01, 10],
  [, 3685.01, 11.21, 44.21, 990.01, 11],
  [, , 12.51, 48.11, 1080.01, 12],
  [, , 13.91, 52.01, 1170.01, 13],
  [, , 15.51, 55.91, 1260.01, 14],
  [, , 17.31, 59.81, 1350.01, 15],
  [, , 19.31, 63.81, 1440.01, 16],
  [, , 21.61, 67.71, 1530.01, 17],
  [, , 24.11, 71.61, 1620.01, 18],
  [, , 26.91, 75.51, 1710.01, 19],
  [, , 30.01, 79.41, 1800.01, 20],
  [, , 33.51, 83.31, 1890.01, 21],
  [, , 37.41, 87.31, 1980.01, 22],
  [, , 41.71, 91.21, 2070.01, 23],
  [, , 46.61, 95.11, 2160.01, 24],
  [, , 52.01, 99.01, 2250.01, 25],
  [, , 58.01, , 2340.01, 26],
  [, , 64.71, , 2430.01, 27],
  [, , 72.31, , 2520.01, 28],
  [, , 80.61, , 2610.01, 29],
  [, , 90.01, , 2700.01, 30],
];
const karori_three = [
  [],
  [, 0, 0, 0, 0, 0],
  [, 335.01, 1.01, 5.01, 90.01, 1],
  [, 670.01, 2.01, 9.01, 180.01, 2],
  [, 1005.01, 3.01, 13.51, 270.01, 3],
  [, 1340.01, 4.01, 18.01, 360.01, 4],
  [, 1675.01, 5.01, 22.51, 450.01, 5],
  [, 2010.01, 6.01, 27.01, 540.01, 6],
  [, 2345.01, 7.01, 31.01, 630.01, 7],
  [, 2680.01, 8.01, 36.01, 720.01, 8],
  [, 3015.01, 9.01, 40.01, 810.01, 9],
  [, 3350.01, 10.01, 45.01, 900.01, 10],
  [, 3685.01, 11.01, , 990.01, 11],
  [, , 12.01, , 1080.01, 12],
  [, , 13.01, , 1170.01, 13],
  [, , 14.01, , 1260.01, 14],
  [, , 15.01, , 1350.01, 15],
  [, , 16.01, , 1440.01, 16],
  [, , 17.01, , 1530.01, 17],
  [, , 18.01, , 1620.01, 18],
  [, , 19.01, , 1710.01, 19],
  [, , 20.01, , 1800.01, 20],
  [, , 21.01, , 1890.01, 21],
  [, , 22.01, , 1980.01, 22],
  [, , 23.01, , 2070.01, 23],
  [, , 24.01, , 2160.01, 24],
  [, , 25.01, , 2250.01, 25],
  [, , 26.01, , 2340.01, 26],
  [, , 27.01, , 2430.01, 27],
  [, , 28.01, , 2520.01, 28],
  [, , 29.01, , 2610.01, 29],
  [, , 30.01, , 2700.01, 30],
];
const profiler = [
  [],
  [, 0.00, 0.00, 0.00, 0.00, 0],
  [, 25.00, 40.01, 0.91, 1.61, 1],
  [, 43.00, 60.01, 1.91, 3.20, 2],
  [, 52.00, 67.01, 2.81, 4.81, 3],
  [, 63.00, 75.01, 3.71, 6.41, 4],
  [, 67.00, 80.01, 4.71, 8.01, 5],
  [, 80.00, 90.01, 5.41, 9.61, 6],
  [, 90.00, 95.01, 6.31, 11.61, 7],
  [, 99.50, 99.51, 7.31, 13.91, 8],
  [, 100, 100, 8.41, 16.71, 9],
  [, , , 9.71, 20.01, 10],
  [, , , 11.21, 24.01, 11],
  [, , , 13.01, 28.91, 12],
  [, , , 15.01, 34.71, 13],
  [, , , 17.31, 41.61, 14],
  [, , , 20.01, 50.01, 15],
];

const search_matched = (searchingVal, searchingRegion, startPoint, endPoint, searchPoint, turn) => {
  let i;
  for (i = startPoint; i <= endPoint; i++) {
    if (searchingVal >= searchingRegion[i][searchPoint] && searchingVal < searchingRegion[i + 1][searchPoint]) {
      return searchingRegion[i][turn];
    }
  }

  return false;
};

const calc_npscCategoryId = (req) => search_matched(req.body.category, hsrCategory, 1, 5, 1, 7);

const calc_npscCategory = (req) => search_matched(req.body.category, hsrCategory, 1, 5, 1, 6);

const calc_baseEnergyPoints = (req) => {
  if (val_npscCategoryId !== 3) {
    return search_matched(req.body.energy, karori_one, 1, 31, 1, 5);
  }
  return search_matched(req.body.energy, karori_three, 1, 31, 1, 5);
};

const calc_baseSaturatedFatPoints = (req) => {
  if (val_npscCategoryId !== 3) {
    return search_matched(req.body.saturatedFat, karori_one, 1, 31, 2, 5);
  }
  return search_matched(req.body.saturatedFat, karori_one, 1, 31, 2, 5);
};

const calc_baseTotalSugarsPoints = (req) => {
  if (val_npscCategoryId !== 3) {
    return search_matched(req.body.totalSugars, karori_one, 1, 26, 3, 5);
  }
  return search_matched(req.body.totalSugars, karori_three, 1, 31, 3, 5);
};

const calc_baseTotalSodiumPoints = (req) => {
  if (val_npscCategoryId !== 3) {
    return search_matched(req.body.sodium, karori_one, 1, 31, 4, 5);
  }
  return search_matched(req.body.sodium, karori_three, 1, 31, 4, 5);
};

const calc_baseTotalPoints = (req) => val_baseEnergyPoints + val_baseSaturatedFatPoints
    + val_baseTotalSugarsPoints + val_baseTotalSodiumPoints;

const calc_allFruitVegConcentrated = (req) => (!!((req.body.consentratedFruit > 0 && req.body.fvnl === 0)));

const calc_wholeFoodPc = (req) => (Math.round((req.body.consentratedFruit + req.body.fvnl) * 100) / 100).toFixed(2);

const calc_fruitVegNutPc = (req) => (Math.round(10000 * (req.body.fvnl + 2 * req.body.consentratedFruit) / (100 + req.body.consentratedFruit)) / 100).toFixed(2);

const calc_modifyingPointsFibre = (req) => {
  if (val_npscCategoryId === 1) {
    return 0;
  }
  return search_matched(req.body.fibre, profiler, 1, 16, 3, 5);
};

const calc_modifyingPointsProtein = (req) => search_matched(req.body.protein, profiler, 1, 16, 4, 5);

const calc_modifyingPointsFvnl = (req) => {
  if (val_allFruitVegConcentrated) {
    return search_matched(req.body.consentratedFruit, profiler, 1, 9, 1, 5);
  }
  return search_matched(req.body.consentratedFruit, profiler, 1, 9, 2, 5);
};

const calc_modifyingPointsTotal = (req) => {
  if (val_baseTotalPoints < 13 || (val_baseTotalPoints >= 13 && val_modifyingPointsFvnl >= 5)) {
    return val_modifyingPointsFvnl + val_modifyingPointsFibre + val_modifyingPointsProtein;
  }
  return val_modifyingPointsFvnl + val_modifyingPointsFibre;
};

const calc_profilerScore = (req) => val_baseTotalPoints - val_modifyingPointsTotal;

const calc_starPoints = (req) => {
  const t1 = val_profilerScore
    - search_matched(req.body.category, hsrCategory, 1, 5, 1, 3);
  const t2 = search_matched(req.body.category, hsrCategory, 1, 5, 1, 4);
  const t3 = search_matched(req.body.category, hsrCategory, 1, 5, 1, 5);
  const temp = Math.round(10.499 - (t1 / t2 * t3));
  return temp < 1 ? 1 : temp < 11 ? temp : 10;
};

const calc_healthStarRating = (req) => {
  const sum_nutrition = req.body.energy + req.body.saturatedFat + req.body.totalSugars + req.body.sodium
    + req.body.fibre + req.body.protein + req.body.consentratedFruit + req.body.fvnl;
  if (sum_nutrition == 0) return 0;
  return val_starPoints / 2.0;
};

let val_healthStarRating = 0.0;
let val_profilerScore = 0;
let val_starPoints = 0;
let val_npscCategoryId = 0;
let val_npscCategory = '';
let val_allFruitVegConcentrated = true;
let val_wholeFoodPc = 1.00;
let val_fruitVegNutPc = 1.00;
let val_baseEnergyPoints = 0;
let val_baseSaturatedFatPoints = 0;
let val_baseTotalSugarsPoints = 0;
let val_baseTotalSodiumPoints = 0;
let val_baseTotalPoints = 0;
let val_modifyingPointsFvnl = 0;
let val_modifyingPointsFibre = 0;
let val_modifyingPointsProtein = 0;
let val_modifyingPointsTotal = 0;

// Endpoint: Get Health Star Ratings
router.post('/hsrCalculator', async (req, res) => {
  val_npscCategoryId = calc_npscCategoryId(req);
  val_npscCategory = calc_npscCategory(req);
  val_baseEnergyPoints = calc_baseEnergyPoints(req);
  val_baseSaturatedFatPoints = calc_baseSaturatedFatPoints(req);
  val_baseTotalSugarsPoints = calc_baseTotalSugarsPoints(req);
  val_baseTotalSodiumPoints = calc_baseTotalSodiumPoints(req);
  val_baseTotalPoints = calc_baseTotalPoints(req);
  val_allFruitVegConcentrated = calc_allFruitVegConcentrated(req);
  val_modifyingPointsFibre = calc_modifyingPointsFibre(req);
  val_modifyingPointsProtein = calc_modifyingPointsProtein(req);
  val_wholeFoodPc = calc_wholeFoodPc(req);
  val_fruitVegNutPc = calc_fruitVegNutPc(req);
  val_modifyingPointsFvnl = calc_modifyingPointsFvnl(req);
  val_modifyingPointsTotal = calc_modifyingPointsTotal(req);
  val_profilerScore = calc_profilerScore(req);
  val_starPoints = calc_starPoints(req);
  val_healthStarRating = calc_healthStarRating(req);

  return res.send({
    healthStarRating: val_healthStarRating,
    profilerScore: val_profilerScore,
    starPoints: val_starPoints,
    npscCategoryId: val_npscCategoryId,
    npscCategory: val_npscCategory,
    allFruitVegConcentrated: val_allFruitVegConcentrated,
    wholeFoodPc: val_wholeFoodPc,
    fruitVegNutPc: val_fruitVegNutPc,
    baseEnergyPoints: val_baseEnergyPoints,
    baseSaturatedFatPoints: val_baseSaturatedFatPoints,
    baseTotalSugarsPoints: val_baseTotalSugarsPoints,
    baseTotalSodiumPoints: val_baseTotalSodiumPoints,
    baseTotalPoints: val_baseTotalPoints,
    modifyingPointsFvnl: val_modifyingPointsFvnl,
    modifyingPointsFibre: val_modifyingPointsFibre,
    modifyingPointsProtein: val_modifyingPointsProtein,
    modifyingPointsTotal: val_modifyingPointsTotal,
  });

  // // check for unique user
  // const emailExists = await User.findOne({ email: req.body.email });
  // if (emailExists) { return res.status(400).send('Email already exists'); }

  // // hash the password
  // const salt = await bcrypt.genSalt(10);
  // const hashPassword = await bcrypt.hash(req.body.password, salt);

  // const user = new User({
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   email: req.body.email,
  //   password: hashPassword,
  // });

  // try {
  //   const savedUser = await user.save();
  //   res.send({ user: savedUser._id, message: 'User successfully registered' });
  // } catch (err) {
  //   res.status(400).send(err);
  // }
});

module.exports = router;
