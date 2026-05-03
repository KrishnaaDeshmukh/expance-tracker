const {
  createExpense,
  getExpensesByPeriod,
  getExpenseCategorySummary,
  getExpensesByDateRange,
} = require('../services/financeStore');

const parsePeriod = (period) => {
  if (period === 'week' || period === 'month') {
    return period;
  }
  return 'day';
};

const addExpense = async (req, res, next) => {
  try {
    const { amount, category, description = '', date } = req.body;
    const parsedAmount = Number(amount);
    const trimmedCategory = typeof category === 'string' ? category.trim() : '';

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'amount must be a positive number' });
    }

    if (!trimmedCategory) {
      return res.status(400).json({ message: 'category is required' });
    }

    const { expense, settings } = await createExpense({
      amount: parsedAmount,
      category: trimmedCategory,
      description,
      date,
    });

    const todayExpenses = await getExpensesByPeriod('day');
    const todayTotal = todayExpenses.reduce((total, item) => total + Number(item.amount || 0), 0);
    const warning = settings.dailyLimit > 0 && todayTotal > settings.dailyLimit;

    return res.status(201).json({
      message: warning ? 'Expense added. Daily limit exceeded.' : 'Expense added successfully',
      expense,
      warning,
      remainingBalance: settings.balance,
      todayTotal,
      dailyLimit: settings.dailyLimit,
    });
  } catch (error) {
    next(error);
  }
};

const listExpenses = async (req, res, next) => {
  try {
    const { startDate, endDate, date } = req.query;

    let expenses;
    if (date) {
      expenses = await getExpensesByDateRange(date, date);
    } else if (startDate && endDate) {
      expenses = await getExpensesByDateRange(startDate, endDate);
    } else {
      expenses = await getExpensesByPeriod(parsePeriod(req.query.period));
    }

    return res.status(200).json({
      expenses,
      count: expenses.length,
      period: parsePeriod(req.query.period),
    });
  } catch (error) {
    next(error);
  }
};

const getCategorySummary = async (req, res, next) => {
  try {
    const period = parsePeriod(req.query.period || 'month');
    const summary = await getExpenseCategorySummary(period);

    return res.status(200).json({
      success: true,
      data: summary,
      period,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  listExpenses,
  getCategorySummary,
};
