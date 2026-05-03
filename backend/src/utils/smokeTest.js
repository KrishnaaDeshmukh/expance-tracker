const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

async function run() {
  console.log('Running smoke tests...');

  await client.post('/income', { source: 'Salary', amount: 5000, date: '2026-05-03', note: 'Monthly salary' });
  await client.post('/expenses', { amount: 200, category: 'Food', description: 'Lunch', date: '2026-05-03' });
  await client.post('/expenses', { amount: 150, category: 'Travel', description: 'Metro', date: '2026-05-02' });
  await client.post('/savings', { amount: 300, type: 'add', date: '2026-05-03', note: 'Saved' });
  await client.post('/savings', { amount: 100, type: 'withdraw', date: '2026-05-03', note: 'Emergency' });
  const lend = await client.post('/lend', { personName: 'Ravi', amount: 250, date: '2026-05-03', note: 'Short loan' });
  await client.patch(`/lend/${lend.data.data._id || lend.data.data.id}`);
  await client.post('/fuel', {
    totalAmountSpent: 500,
    pricePerLiter: 100,
    odometerReading: 10000,
    date: '2026-05-02',
  });
  await client.post('/fuel', {
    totalAmountSpent: 450,
    pricePerLiter: 100,
    odometerReading: 10300,
    date: '2026-05-03',
  });

  const summary = await client.get('/summary');
  const categories = await client.get('/expenses/category-summary');

  console.log('Summary totals:', summary.data.totals);
  console.log('Category summary count:', categories.data.data.length);
  console.log('Charts:', {
    weeklyTrend: summary.data.charts?.weeklyTrend?.length,
    monthlyTrend: summary.data.charts?.monthlyTrend?.length,
    savingsTrend: summary.data.charts?.savingsTrend?.length,
  });

  console.log('Smoke tests completed successfully');
}

run().catch((error) => {
  console.error('Smoke test failed:', error.response?.data || error.message);
  process.exit(1);
});
