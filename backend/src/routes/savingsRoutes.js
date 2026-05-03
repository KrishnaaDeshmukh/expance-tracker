const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');

/**
 * POST /api/savings
 * Add a new savings entry
 * Body: { amount, date, note? }
 */
router.post('/', savingsController.addSavingsEntry);

/**
 * GET /api/savings
 * List savings entries
 * Query: ?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
router.get('/', savingsController.listSavingsEntries);

/**
 * GET /api/savings/summary
 * Get savings statistics (total, today, monthly, goal, progress)
 */
router.get('/summary', savingsController.getSavingsSummary);

/**
 * GET /api/savings/monthly
 * Get detailed monthly savings data
 */
router.get('/monthly', savingsController.getMonthlyDetails);

/**
 * POST /api/savings/goal
 * Set monthly savings goal
 * Body: { goal }
 */
router.post('/goal', savingsController.setMonthlyGoal);

module.exports = router;
