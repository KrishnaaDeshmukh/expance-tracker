const financeStore = require('./financeStore');
const incomeStore = require('./incomeStore');
const lendStore = require('./lendStore');
const savingsStore = require('./savingsStore');

async function getDashboardSummary() {
  const [baseSummary, incomeStats, lendStats, savingsStats, categorySummary, weeklyTrend, monthlyTrend, monthExpenses, totalExpenses, monthlySavings] = await Promise.all([
    financeStore.getSummary(),
    incomeStore.calculateIncomeStats(),
    lendStore.calculateLendStats(),
    savingsStore.calculateSavingsStats(),
    financeStore.getExpenseCategorySummary('month'),
    financeStore.getExpenseTrend('week'),
    financeStore.getExpenseTrend('month'),
    financeStore.getExpensesByPeriod('month'),
    financeStore.getTotalExpenses(),
    savingsStore.getMonthlysSavings(),
  ]);

  const currentSavings = savingsStats.totalSavings;
  const activeLendAmount = lendStats.activeLendAmount;
  const totalIncome = incomeStats.totalIncome;
  const totalExpensesAll = Number(totalExpenses || 0);
  const remainingBalance = Number(baseSummary.settings.balance || 0);

  return {
    ...baseSummary,
    totals: {
      ...baseSummary.totals,
      income: totalIncome,
      expenses: totalExpensesAll,
      savings: currentSavings,
      lendActive: activeLendAmount,
      lendReturned: lendStats.returnedAmount,
    },
    finance: {
      currentBalance: remainingBalance,
      totalIncome,
      totalExpenses: totalExpensesAll,
      activeLendAmount,
      currentSavings,
      formula: 'Balance = Initial Balance + Total Income - Total Expenses - Active Lend Amount - Current Savings',
    },
    income: incomeStats,
    lend: lendStats,
    savings: savingsStats,
    charts: {
      categorySummary,
      weeklyTrend,
      monthlyTrend,
      savingsTrend: monthlySavings?.entries || [],
    },
    expenseEntries: monthExpenses || [],
  };
}

module.exports = {
  getDashboardSummary,
};
