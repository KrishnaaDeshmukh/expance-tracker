const {
  createFuelEntry,
  getAllFuelEntries,
  getRecentFuelEntries,
  getFuelByDateRange,
  calculateFuelStats,
  getMonthlyFuelSpending,
} = require('../services/fuelStore');

const addFuelEntry = async (req, res, next) => {
  try {
    const { totalAmountSpent, pricePerLiter, litersFilled, odometerReading, date } = req.body;

    const fuelEntry = await createFuelEntry({
      totalAmountSpent,
      pricePerLiter,
      litersFilled,
      odometerReading,
      date,
    });

    res.status(201).json({
      success: true,
      data: fuelEntry,
      message: 'Fuel entry added successfully',
    });
  } catch (error) {
    next(error);
  }
};

const listFuelEntries = async (req, res, next) => {
  try {
    const { limit = 100, startDate, endDate } = req.query;

    let entries;

    if (startDate && endDate) {
      entries = await getFuelByDateRange(startDate, endDate);
    } else if (limit) {
      entries = await getRecentFuelEntries(parseInt(limit, 10));
    } else {
      entries = await getAllFuelEntries();
    }

    res.json({
      success: true,
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    next(error);
  }
};

const getFuelStats = async (req, res, next) => {
  try {
    const stats = await calculateFuelStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyStats = async (req, res, next) => {
  try {
    const { monthOffset = 0 } = req.query;

    const entries = await getMonthlyFuelSpending(parseInt(monthOffset, 10));

    const totalSpent = entries.reduce((sum, entry) => sum + entry.totalAmountSpent, 0);
    const totalLiters = entries.reduce((sum, entry) => sum + entry.litersFilled, 0);
    const mileages = entries.filter((e) => e.mileage !== null).map((e) => e.mileage);
    const averageMileage = mileages.length > 0 ? mileages.reduce((a, b) => a + b, 0) / mileages.length : null;

    res.json({
      success: true,
      data: {
        totalSpent: Number(totalSpent.toFixed(2)),
        totalLiters: Number(totalLiters.toFixed(2)),
        averageMileage: averageMileage ? Number(averageMileage.toFixed(2)) : null,
        entryCount: entries.length,
        entries,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFuelEntry,
  listFuelEntries,
  getFuelStats,
  getMonthlyStats,
};
