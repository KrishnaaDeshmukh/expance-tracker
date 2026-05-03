const express = require('express');
const { addFuelEntry, listFuelEntries, getFuelStats, getMonthlyStats } = require('../controllers/fuelController');

const router = express.Router();

router.post('/', addFuelEntry);
router.get('/', listFuelEntries);
router.get('/average', getFuelStats);
router.get('/monthly', getMonthlyStats);

module.exports = router;
