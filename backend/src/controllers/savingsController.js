const savingsStore = require('../services/savingsStore');

/**
 * Add a new savings entry
 */
async function addSavingsEntry(req, res, next) {
  try {
    const { amount, date, note, type } = req.body;

    const entry = await savingsStore.createSavingsEntry({
      amount,
      date,
      note,
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Savings entry added successfully',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all savings entries
 */
async function listSavingsEntries(req, res, next) {
  try {
    const { limit, startDate, endDate } = req.query;

    let entries;
    if (startDate && endDate) {
      entries = await savingsStore.getSavingsByDateRange(startDate, endDate);
    } else {
      entries = await savingsStore.getAllSavingsEntries();
    }

    if (limit) {
      entries = entries.slice(0, parseInt(limit));
    }

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get savings statistics and summary
 */
async function getSavingsSummary(req, res, next) {
  try {
    const stats = await savingsStore.calculateSavingsStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get monthly savings details
 */
async function getMonthlyDetails(req, res, next) {
  try {
    const details = await savingsStore.getMonthlyDetails();

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Set monthly savings goal
 */
async function setMonthlyGoal(req, res, next) {
  try {
    const { goal } = req.body;

    if (goal === undefined || goal === null) {
      throw new Error('Goal is required');
    }

    const result = await savingsStore.setMonthlySavingsGoal(goal);

    res.status(200).json({
      success: true,
      message: 'Monthly savings goal updated',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addSavingsEntry,
  listSavingsEntries,
  getSavingsSummary,
  getMonthlyDetails,
  setMonthlyGoal,
};
