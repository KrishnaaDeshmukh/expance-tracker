const express = require('express');
const { addExpense, listExpenses, getCategorySummary } = require('../controllers/expenseController');

const router = express.Router();

router.post('/', addExpense);
router.get('/', listExpenses);
router.get('/category-summary', getCategorySummary);

module.exports = router;
