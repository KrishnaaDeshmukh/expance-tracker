const supabase = require('../config/supabase');
const { getSettings, updateSettings } = require('./financeStore');

const fallbackLendEntries = [];

const toDateOnly = (date) => {
  if (typeof date === 'string') return date;
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapLend = (row) => ({
  _id: row.id,
  personName: row.person_name,
  amount: Number(row.amount),
  status: row.status || 'given',
  date: row.date,
  note: row.note || '',
  returnedAt: row.returned_at || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

async function createLendEntry({ personName, amount, date, note = '' }) {
  const parsedAmount = Number(amount);
  if (!personName || !String(personName).trim()) {
    throw new Error('Person name is required');
  }
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (!date) {
    throw new Error('Date is required');
  }

  const payload = {
    person_name: String(personName).trim(),
    amount: parsedAmount,
    status: 'given',
    date: toDateOnly(date),
    note: note || '',
  };

  const { data, error } = await supabase.from('lend').insert(payload).select('*').single();
  const currentSettings = await getSettings();
  await updateSettings({ balance: currentSettings.balance - parsedAmount });

  if (error) {
    const fallbackEntry = {
      id: Date.now(),
      ...payload,
      returned_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    fallbackLendEntries.unshift(fallbackEntry);
    return mapLend(fallbackEntry);
  }

  return mapLend(data);
}

async function getAllLendEntries() {
  const { data, error } = await supabase.from('lend').select('*').order('date', { ascending: false }).order('created_at', { ascending: false });
  if (error) {
    return [...fallbackLendEntries].map(mapLend);
  }
  return (data || []).map(mapLend);
}

async function markLendReturned(id) {
  const entries = await getAllLendEntries();
  const entry = entries.find((item) => String(item._id) === String(id));
  if (!entry) {
    throw new Error('Lend entry not found');
  }
  if (entry.status === 'returned') {
    return entry;
  }

  const returnedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('lend')
    .update({ status: 'returned', returned_at: returnedAt })
    .eq('id', id)
    .select('*')
    .single();

  const currentSettings = await getSettings();
  await updateSettings({ balance: currentSettings.balance + entry.amount });

  if (error) {
    const fallbackEntry = fallbackLendEntries.find((item) => String(item.id) === String(id));
    if (!fallbackEntry) {
      throw error;
    }
    fallbackEntry.status = 'returned';
    fallbackEntry.returned_at = returnedAt;
    fallbackEntry.updated_at = returnedAt;
    return mapLend(fallbackEntry);
  }

  return mapLend(data);
}

async function calculateLendStats() {
  const allEntries = await getAllLendEntries();
  const totalGiven = allEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const activeLendAmount = allEntries.filter((entry) => entry.status !== 'returned').reduce((sum, entry) => sum + entry.amount, 0);
  const returnedAmount = allEntries.filter((entry) => entry.status === 'returned').reduce((sum, entry) => sum + entry.amount, 0);

  return {
    totalGiven: Number(totalGiven.toFixed(2)),
    activeLendAmount: Number(activeLendAmount.toFixed(2)),
    returnedAmount: Number(returnedAmount.toFixed(2)),
    pendingCount: allEntries.filter((entry) => entry.status !== 'returned').length,
    returnedCount: allEntries.filter((entry) => entry.status === 'returned').length,
    entries: allEntries,
  };
}

module.exports = {
  createLendEntry,
  getAllLendEntries,
  markLendReturned,
  calculateLendStats,
};
