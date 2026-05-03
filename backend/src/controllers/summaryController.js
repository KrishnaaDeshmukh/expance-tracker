const { getDashboardSummary } = require('../services/dashboardStore');

const getSummary = async (_req, res, next) => {
  try {
    const summary = await getDashboardSummary();

    return res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
