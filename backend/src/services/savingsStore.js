const supabase = require('../config/supabase');
const { getSettings, updateSettings } = require('./financeStore');

const fallbackSavingsEntries = [];
let fallbackMonthlySavingsGoal = 0;

/**
 * Map Supabase row to app format (snake_case → camelCase)
 */
function mapSavings(row) {
  if (!row) return null;
  return {
    id: row.id,
    amount: parseFloat(row.amount),
    type: row.type || 'add',
    date: row.date,
    note: row.note || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert date to YYYY-MM-DD format
 */
function toDateOnly(date) {
  if (typeof date === 'string') return date;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current month date range
 */
function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return {
    startDate: toDateOnly(startDate),
    endDate: toDateOnly(endDate),
  };
}

/**
 * Add a new savings entry
 * @param {number} amount - Amount saved (must be > 0)
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {string} note - Optional note
 * @returns {Promise} Created entry
 */
async function createSavingsEntry({ amount, date, note = '', type = 'add' }) {
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (!date) {
    throw new Error('Date is required');
  }

  const entryType = String(type || 'add').toLowerCase();
  if (!['add', 'withdraw'].includes(entryType)) {
    throw new Error('Type must be add or withdraw');
  }

  const allEntries = await getAllSavingsEntries();
  const currentSavings = allEntries.reduce((sum, entry) => {
    const signed = entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0);
    return sum + signed;
  }, 0);

  if (entryType === 'withdraw' && currentSavings - Number(amount) < 0) {
    throw new Error('Savings cannot go negative');
  }

  const normalizedDate = toDateOnly(date);

  const { data, error } = await supabase
    .from('savings')
    .insert([
      {
        amount: parseFloat(amount),
        type: entryType,
        date: normalizedDate,
        note: note || '',
      },
    ])
    .select();

  const currentSettings = await getSettings();
  const signedAmount = entryType === 'withdraw' ? Number(amount) : -Number(amount);
  await updateSettings({ balance: currentSettings.balance + signedAmount });

  if (error) {
    const fallbackEntry = {
      id: Date.now(),
      amount: parseFloat(amount),
      type: entryType,
      date: normalizedDate,
      note: note || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    fallbackSavingsEntries.unshift(fallbackEntry);
    return mapSavings(fallbackEntry);
  }

  return mapSavings(data[0]);
}

/**
 * Get all savings entries
 * @returns {Promise} Array of savings entries
 */
async function getAllSavingsEntries() {
  const { data, error } = await supabase
    .from('savings')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    return fallbackSavingsEntries.map(mapSavings);
  }

  return data.map(mapSavings);
}

/**
 * Get savings by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise} Array of entries
 */
async function getSavingsByDateRange(startDate, endDate) {
  const { data, error } = await supabase
    .from('savings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) {
    return fallbackSavingsEntries
      .filter((entry) => entry.date >= startDate && entry.date <= endDate)
      .map(mapSavings)
      .sort((left, right) => new Date(right.date) - new Date(left.date));
  }

  return data.map(mapSavings);
}

/**
 * Get today's savings total
 * @returns {Promise} Total savings for today
 */
async function getTodaysSavings() {
  const today = toDateOnly(new Date());
  const entries = await getSavingsByDateRange(today, today);
  return entries.reduce((sum, entry) => {
    const signed = entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0);
    return sum + signed;
  }, 0);
}

/**
 * Get current month's savings
 * @returns {Promise} Array of entries and total
 */
async function getMonthlysSavings() {
  const { startDate, endDate } = getCurrentMonthRange();
  const entries = await getSavingsByDateRange(startDate, endDate);
  const totalSavings = entries.reduce((sum, entry) => {
    const signed = entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0);
    return sum + signed;
  }, 0);
  return {
    entries,
    totalSavings,
    startDate,
    endDate,
  };
}

/**
 * Calculate savings statistics
 * @returns {Promise} Object with stats
 */
async function calculateSavingsStats() {
  try {
    const allEntries = await getAllSavingsEntries();
    const todaysSavings = await getTodaysSavings();
    const monthly = await getMonthlysSavings();

    // Get settings (including goal)
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
        const monthlyGoal = Number(fallbackMonthlySavingsGoal || 0);
        const monthlyTotal = monthly.totalSavings;
        const remainingToGoal = Math.max(0, monthlyGoal - monthlyTotal);

        return {
          totalSavings: allEntries.reduce((sum, entry) => {
            const signed = entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0);
            return sum + signed;
          }, 0),
          todaysSavings,
          monthlySavings: monthlyTotal,
          monthlyGoal,
          remainingToGoal,
          goalProgress: monthlyGoal > 0 ? (monthlyTotal / monthlyGoal) * 100 : 0,
          totalEntries: allEntries.length,
        };
    }

    const monthlyGoal = Number(settings?.monthly_savings_goal ?? fallbackMonthlySavingsGoal ?? 0);
    const monthlyTotal = monthly.totalSavings;
    const remainingToGoal = Math.max(0, monthlyGoal - monthlyTotal);

    return {
      totalSavings: allEntries.reduce((sum, entry) => {
        const signed = entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0);
        return sum + signed;
      }, 0),
      todaysSavings,
      monthlySavings: monthlyTotal,
      monthlyGoal,
      remainingToGoal,
      goalProgress: monthlyGoal > 0 ? (monthlyTotal / monthlyGoal) * 100 : 0,
      totalEntries: allEntries.length,
    };
  } catch (error) {
    throw new Error(`Failed to calculate stats: ${error.message}`);
  }
}

/**
 * Set monthly savings goal
 * @param {number} goal - Monthly goal amount
 * @returns {Promise} Updated settings
 */
async function setMonthlySavingsGoal(goal) {
  if (goal < 0) {
    throw new Error('Goal cannot be negative');
  }

  const parsedGoal = parseFloat(goal);

  const { data, error } = await supabase
    .from('settings')
    .update({ monthly_savings_goal: parsedGoal })
    .eq('id', 1)
    .select();

  if (error) {
    fallbackMonthlySavingsGoal = parsedGoal;
    return {
      goal: parsedGoal,
      persisted: false,
    };
  }

  fallbackMonthlySavingsGoal = parsedGoal;

  return {
    goal: parseFloat(data[0].monthly_savings_goal ?? parsedGoal),
    persisted: true,
  };
}

/**
 * Get current month's entries with details
 * @returns {Promise} Detailed monthly data
 */
async function getMonthlyDetails() {
  const monthly = await getMonthlysSavings();
  const stats = await calculateSavingsStats();

  return {
    entries: monthly.entries,
    totalSavings: monthly.totalSavings,
    monthlyGoal: stats.monthlyGoal,
    remainingToGoal: stats.remainingToGoal,
    goalProgress: stats.goalProgress,
    startDate: monthly.startDate,
    endDate: monthly.endDate,
  };
}

module.exports = {
  createSavingsEntry,
  getAllSavingsEntries,
  getSavingsByDateRange,
  getTodaysSavings,
  getMonthlysSavings,
  calculateSavingsStats,
  setMonthlySavingsGoal,
  getMonthlyDetails,
  toDateOnly,
};
