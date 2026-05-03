const supabase = require('../config/supabase');
const { getSettings, updateSettings } = require('./financeStore');

const fallbackIncomeEntries = [];

const toDateOnly = (date) => {
  if (typeof date === 'string') return date;
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapIncome = (row) => ({
  _id: row.id,
  source: row.source,
  amount: Number(row.amount),
  date: row.date,
  note: row.note || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getTodayBounds = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: toDateOnly(start), end: toDateOnly(end) };
};

const getMonthBounds = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start: toDateOnly(start), end: toDateOnly(end) };
};

async function createIncomeEntry({ source, amount, date, note = '' }) {
  const parsedAmount = Number(amount);
  if (!source || !String(source).trim()) {
    throw new Error('Source is required');
  }
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (!date) {
    throw new Error('Date is required');
  }

  const payload = {
    source: String(source).trim(),
    amount: parsedAmount,
    date: toDateOnly(date),
    note: note || '',
  };

  const { data, error } = await supabase.from('income').insert(payload).select('*').single();
  const currentSettings = await getSettings();
  await updateSettings({ balance: currentSettings.balance + parsedAmount });

  if (error) {
    const fallbackEntry = {
      id: Date.now(),
      source: payload.source,
      amount: payload.amount,
      date: payload.date,
      note: payload.note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    fallbackIncomeEntries.unshift(fallbackEntry);
    return mapIncome(fallbackEntry);
  }

  return mapIncome(data);
}

async function getAllIncomeEntries() {
  const { data, error } = await supabase.from('income').select('*').order('date', { ascending: false }).order('created_at', { ascending: false });
  if (error) {
    return [...fallbackIncomeEntries].map(mapIncome);
  }
  return (data || []).map(mapIncome);
}

async function getIncomeByDateRange(startDate, endDate) {
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .gte('date', toDateOnly(startDate))
    .lte('date', toDateOnly(endDate))
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    return fallbackIncomeEntries
      .filter((entry) => entry.date >= toDateOnly(startDate) && entry.date <= toDateOnly(endDate))
      .map(mapIncome);
  }
  return (data || []).map(mapIncome);
}

async function calculateIncomeStats() {
  const allEntries = await getAllIncomeEntries();
  const { start: todayStart, end: todayEnd } = getTodayBounds();
  const { start: monthStart, end: monthEnd } = getMonthBounds();
  const todaysEntries = await getIncomeByDateRange(todayStart, todayEnd);
  const monthEntries = await getIncomeByDateRange(monthStart, monthEnd);

  const totalIncome = allEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const todayIncome = todaysEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const monthIncome = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    todayIncome: Number(todayIncome.toFixed(2)),
    monthIncome: Number(monthIncome.toFixed(2)),
    totalEntries: allEntries.length,
    entries: allEntries,
    monthEntries,
  };
}

module.exports = {
  createIncomeEntry,
  getAllIncomeEntries,
  getIncomeByDateRange,
  calculateIncomeStats,
};
