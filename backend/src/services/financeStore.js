const supabase = require('../config/supabase');
const { getRange } = require('../utils/dateRanges');

const SETTINGS_ID = 1;

const toDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toLocalDateString = (value) => {
  const date = value ? new Date(value) : new Date();
  return toDateOnly(date);
};

const mapExpense = (row) => ({
  _id: row.id,
  amount: Number(row.amount),
  category: row.category,
  description: row.description || '',
  date: row.date,
  createdAt: row.created_at,
});

const mapSetting = (row) => ({
  id: row.id,
  dailyLimit: Number(row.daily_limit || 0),
  balance: Number(row.balance || 0),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const ensureSettingsRow = async () => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', SETTINGS_ID).maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return mapSetting(data);
  }

  const { data: inserted, error: insertError } = await supabase
    .from('settings')
    .insert({ id: SETTINGS_ID, daily_limit: 0, balance: 0 })
    .select('*')
    .single();

  if (insertError) {
    throw insertError;
  }

  return mapSetting(inserted);
};

const getSettings = async () => ensureSettingsRow();

const updateSettings = async ({ dailyLimit, balance }) => {
  const current = await ensureSettingsRow();
  const nextSettings = {
    id: SETTINGS_ID,
    daily_limit: dailyLimit !== undefined ? Number(dailyLimit) : current.dailyLimit,
    balance: balance !== undefined ? Number(balance) : current.balance,
  };

  const { data, error } = await supabase.from('settings').upsert(nextSettings, { onConflict: 'id' }).select('*').single();

  if (error) {
    throw error;
  }

  return mapSetting(data);
};

const createExpense = async ({ amount, category, description = '', date }) => {
  const settings = await ensureSettingsRow();
  // normalize amount to two decimal places to avoid floating precision issues
  const amountValue = Number(Number(amount).toFixed(2));

  const payload = {
    amount: amountValue,
    category,
    description,
    date: toLocalDateString(date),
  };

  const { data, error } = await supabase.from('expenses').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  // update balance with fixed two-decimal precision
  const currentBalance = Number(settings.balance || 0);
  const nextBalance = Number((currentBalance - amountValue).toFixed(2));
  const nextSettings = await updateSettings({ balance: nextBalance, dailyLimit: settings.dailyLimit });

  return {
    expense: mapExpense(data),
    settings: nextSettings,
  };
};

const getExpensesByPeriod = async (period = 'day') => {
  const { start, end } = getRange(period);
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('date', toDateOnly(start))
    .lt('date', toDateOnly(end))
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapExpense);
};

const getExpensesByDateRange = async (startDate, endDate) => {
  const start = toDateOnly(new Date(startDate));
  const end = toDateOnly(new Date(endDate));
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapExpense);
};

const getAllRecentExpenses = async (limit = 5) => {
  const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(limit);

  if (error) {
    throw error;
  }

  return data.map(mapExpense);
};

const getTotalExpenses = async () => {
  const { data, error } = await supabase.from('expenses').select('amount');
  if (error) {
    throw error;
  }

  return (data || []).reduce((sum, row) => sum + Number(row.amount || 0), 0);
};

const sumExpenses = (expenses) => expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);

const buildDateRangeKeys = (start, end) => {
  const keys = [];
  const cursor = new Date(start);
  while (cursor < end) {
    keys.push(toDateOnly(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
};

const getSummary = async () => {
  const settings = await ensureSettingsRow();
  const [todayExpenses, weekExpenses, monthExpenses, recentTransactions] = await Promise.all([
    getExpensesByPeriod('day'),
    getExpensesByPeriod('week'),
    getExpensesByPeriod('month'),
    getAllRecentExpenses(5),
  ]);

  const todayTotal = sumExpenses(todayExpenses);
  const weekTotal = sumExpenses(weekExpenses);
  const monthTotal = sumExpenses(monthExpenses);
  const remainingDailyBudget = settings.dailyLimit > 0 ? settings.dailyLimit - todayTotal : null;
  const warning = settings.dailyLimit > 0 && todayTotal > settings.dailyLimit;

  return {
    totals: {
      today: todayTotal,
      week: weekTotal,
      month: monthTotal,
    },
    settings,
    remainingDailyBudget,
    remainingBalance: settings.balance,
    warning,
    recentTransactions,
  };
};

const getExpenseCategorySummary = async (period = 'month') => {
  const expenses = await getExpensesByPeriod(period);
  const totals = new Map();

  expenses.forEach((expense) => {
    const category = expense.category || 'Other';
    totals.set(category, (totals.get(category) || 0) + Number(expense.amount || 0));
  });

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total: Number(total.toFixed(2)) }))
    .sort((left, right) => right.total - left.total);
};

const getExpenseTrend = async (period = 'week') => {
  const { start, end } = getRange(period);
  const expenses = await getExpensesByPeriod(period);
  const totals = new Map();

  expenses.forEach((expense) => {
    const key = expense.date;
    totals.set(key, (totals.get(key) || 0) + Number(expense.amount || 0));
  });

  return buildDateRangeKeys(start, end).map((date) => ({
    date,
    total: Number((totals.get(date) || 0).toFixed(2)),
  }));
};

const resetAndSeed = async ({ settings, expenses }) => {
  const { error: expenseDeleteError } = await supabase.from('expenses').delete().gte('id', 0);
  if (expenseDeleteError) {
    throw expenseDeleteError;
  }

  const { error: settingsDeleteError } = await supabase.from('settings').delete().gte('id', 0);
  if (settingsDeleteError) {
    throw settingsDeleteError;
  }

  const { error: settingsInsertError } = await supabase
    .from('settings')
    .insert({ id: SETTINGS_ID, daily_limit: settings.dailyLimit, balance: settings.balance });

  if (settingsInsertError) {
    throw settingsInsertError;
  }

  const normalizedExpenses = expenses.map((expense) => ({
    amount: expense.amount,
    category: expense.category,
    description: expense.description || '',
    date: toLocalDateString(expense.date),
  }));

  const { error: expenseInsertError } = await supabase.from('expenses').insert(normalizedExpenses);
  if (expenseInsertError) {
    throw expenseInsertError;
  }

  return getSummary();
};

module.exports = {
  getSettings,
  updateSettings,
  createExpense,
  getExpensesByPeriod,
  getExpensesByDateRange,
  getAllRecentExpenses,
  getTotalExpenses,
  getSummary,
  getExpenseCategorySummary,
  getExpenseTrend,
  resetAndSeed,
};