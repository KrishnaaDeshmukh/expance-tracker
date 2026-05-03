const lendStore = require('../services/lendStore');

async function addLendEntry(req, res, next) {
  try {
    const { personName, amount, date, note } = req.body;
    const entry = await lendStore.createLendEntry({ personName, amount, date, note });

    res.status(201).json({
      success: true,
      message: 'Lend entry added successfully',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function listLendEntries(_req, res, next) {
  try {
    const entries = await lendStore.getAllLendEntries();
    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
}

async function returnLendEntry(req, res, next) {
  try {
    const { id } = req.params;
    const entry = await lendStore.markLendReturned(id);
    res.status(200).json({
      success: true,
      message: 'Lend entry marked as returned',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
}

async function getLendSummary(req, res, next) {
  try {
    const stats = await lendStore.calculateLendStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addLendEntry,
  listLendEntries,
  returnLendEntry,
  getLendSummary,
};
