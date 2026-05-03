const { getSettings, updateSettings } = require('../services/financeStore');

const getOrCreateSettings = async () => getSettings();

const updateLimit = async (req, res, next) => {
  try {
    const { dailyLimit, balance, initialBalance } = req.body;
    const parsedLimit = Number(dailyLimit);
    const nextBalance = balance ?? initialBalance;

    if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
      return res.status(400).json({ message: 'dailyLimit must be a non-negative number' });
    }

    const update = { dailyLimit: parsedLimit };
    if (nextBalance !== undefined) {
      const parsedBalance = Number(nextBalance);
      if (!Number.isFinite(parsedBalance)) {
        return res.status(400).json({ message: 'balance must be a valid number' });
      }
      update.balance = parsedBalance;
    }

    const settings = await updateSettings(update);

    return res.status(200).json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateSettings,
  updateLimit,
};
