const supabase = require('../config/supabase');

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

const mapFuel = (row) => ({
  _id: row.id,
  totalAmountSpent: Number(row.total_amount_spent),
  pricePerLiter: Number(row.price_per_liter),
  litersFilled: Number(row.liters_filled),
  odometerReading: Number(row.odometer_reading),
  mileage: row.mileage ? Number(row.mileage) : null,
  costPerKm: row.cost_per_km ? Number(row.cost_per_km) : null,
  date: row.date,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Calculate liters if not provided
const calculateLiters = (totalAmountSpent, pricePerLiter, litersFilled) => {
  if (litersFilled && litersFilled > 0) {
    return Number(litersFilled);
  }
  if (totalAmountSpent && pricePerLiter && pricePerLiter > 0) {
    return Number(totalAmountSpent) / Number(pricePerLiter);
  }
  return 0;
};

// Get last fuel entry for calculating mileage
const getLastFuelEntry = async () => {
  const { data, error } = await supabase
    .from('fuel')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapFuel(data) : null;
};

// Create fuel entry
const createFuelEntry = async ({ totalAmountSpent, pricePerLiter, litersFilled, odometerReading, date }) => {
  // Validate inputs
  if (!totalAmountSpent || totalAmountSpent <= 0) {
    throw new Error('Total amount spent must be greater than 0');
  }
  if (!pricePerLiter || pricePerLiter <= 0) {
    throw new Error('Price per liter must be greater than 0');
  }
  if (!odometerReading || odometerReading < 0) {
    throw new Error('Odometer reading must be a positive number');
  }

  // Calculate liters if not provided
  const calculated_liters = calculateLiters(totalAmountSpent, pricePerLiter, litersFilled);

  // Get last entry to calculate distance and mileage
  const lastEntry = await getLastFuelEntry();

  let mileage = null;
  let costPerKm = null;
  let distance = null;

  if (lastEntry) {
    distance = odometerReading - lastEntry.odometerReading;

    // Validate odometer always increases
    if (distance < 0) {
      throw new Error('Odometer reading must be greater than or equal to the previous reading');
    }

    if (distance > 0 && calculated_liters > 0) {
      mileage = distance / calculated_liters;
      costPerKm = totalAmountSpent / distance;
    }
  }

  const payload = {
    total_amount_spent: Number(totalAmountSpent),
    price_per_liter: Number(pricePerLiter),
    liters_filled: calculated_liters,
    odometer_reading: Number(odometerReading),
    mileage: mileage || null,
    cost_per_km: costPerKm || null,
    date: toLocalDateString(date),
  };

  const { data, error } = await supabase.from('fuel').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return mapFuel(data);
};

// Get all fuel entries
const getAllFuelEntries = async () => {
  const { data, error } = await supabase
    .from('fuel')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapFuel);
};

// Get recent fuel entries with limit
const getRecentFuelEntries = async (limit = 10) => {
  const { data, error } = await supabase
    .from('fuel')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data || []).map(mapFuel);
};

// Get fuel entries by date range
const getFuelByDateRange = async (startDate, endDate) => {
  const start = toDateOnly(new Date(startDate));
  const end = toDateOnly(new Date(endDate));

  const { data, error } = await supabase
    .from('fuel')
    .select('*')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapFuel);
};

// Calculate fuel statistics
const calculateFuelStats = async () => {
  const { data, error } = await supabase
    .from('fuel')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      totalEntries: 0,
      latestMileage: null,
      averageMileage: null,
      overallCostPerKm: null,
      totalFuelCost: 0,
      totalLitersFilled: 0,
      allMileages: [],
    };
  }

  const mappedData = data.map(mapFuel);
  const mileages = mappedData.filter((entry) => entry.mileage !== null).map((entry) => entry.mileage);
  const costPerKmValues = mappedData
    .filter((entry) => entry.costPerKm !== null)
    .map((entry) => entry.costPerKm);

  const averageMileage = mileages.length > 0 ? mileages.reduce((a, b) => a + b, 0) / mileages.length : null;
  const overallCostPerKm = costPerKmValues.length > 0 ? costPerKmValues.reduce((a, b) => a + b, 0) / costPerKmValues.length : null;

  const totalFuelCost = mappedData.reduce((sum, entry) => sum + entry.totalAmountSpent, 0);
  const totalLitersFilled = mappedData.reduce((sum, entry) => sum + entry.litersFilled, 0);

  return {
    totalEntries: mappedData.length,
    latestMileage: mappedData[mappedData.length - 1]?.mileage || null,
    averageMileage: averageMileage ? Number(averageMileage.toFixed(2)) : null,
    overallCostPerKm: overallCostPerKm ? Number(overallCostPerKm.toFixed(2)) : null,
    totalFuelCost: Number(totalFuelCost.toFixed(2)),
    totalLitersFilled: Number(totalLitersFilled.toFixed(2)),
    allMileages: mileages.map((m) => Number(m.toFixed(2))),
  };
};

// Get monthly fuel spending
const getMonthlyFuelSpending = async (monthOffset = 0) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() - monthOffset;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return getFuelByDateRange(startDate, endDate);
};

module.exports = {
  createFuelEntry,
  getAllFuelEntries,
  getRecentFuelEntries,
  getFuelByDateRange,
  calculateFuelStats,
  getMonthlyFuelSpending,
  getLastFuelEntry,
};
