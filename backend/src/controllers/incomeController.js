const incomeStore = require('../services/incomeStore');

async function addIncome(req, res, next) {
  try {
    const { source, amount, date, note } = req.body;
    const entry = await incomeStore.createIncomeEntry({ source, amount, date, note });

    res.status(201).json({
      success: true,
      message: 'Income entry added successfully',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function listIncome(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const entries = startDate && endDate ? await incomeStore.getIncomeByDateRange(startDate, endDate) : await incomeStore.getAllIncomeEntries();

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
}

async function getIncomeSummary(req, res, next) {
  try {
    const stats = await incomeStore.calculateIncomeStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addIncome,
  listIncome,
  getIncomeSummary,
};
