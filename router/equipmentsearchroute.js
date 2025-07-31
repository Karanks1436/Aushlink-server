const express = require('express');
const router = express.Router();
const { getEquipmentsByCity,getDistinctCities,} = require('../controller/equipmentsearchcontroller');

router.post('/by-city', getEquipmentsByCity);
router.get('/cities', getDistinctCities);

module.exports = router;
