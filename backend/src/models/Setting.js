const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    dailyLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
