const express = require('express');
const incomeController = require('../controllers/incomeController');

const router = express.Router();

router.post('/', incomeController.addIncome);
router.get('/', incomeController.listIncome);
router.get('/summary', incomeController.getIncomeSummary);

module.exports = router;
