require('dotenv').config();
const { resetAndSeed } = require('./services/financeStore');

const seed = async () => {
  await resetAndSeed({
    settings: { dailyLimit: 50, balance: 1200 },
    expenses: [
      { amount: 12.5, category: 'Food', description: 'Lunch', date: new Date() },
      { amount: 25, category: 'Transport', description: 'Taxi to office', date: new Date() },
      { amount: 40, category: 'Bills', description: 'Internet bill', date: new Date(Date.now() - 86400000) },
      { amount: 18, category: 'Groceries', description: 'Snacks and fruit', date: new Date(Date.now() - 2 * 86400000) },
    ],
  });

  console.log('Seed completed successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
