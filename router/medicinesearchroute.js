const express = require('express');
const router = express.Router();
const { getMedicinesByCity,getDistinctCities,} = require('../controller/medicineserachcontroller');

router.post('/by-city', getMedicinesByCity);
router.get('/cities', getDistinctCities);

module.exports = router;
