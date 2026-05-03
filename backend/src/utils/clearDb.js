const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const supabase = require('../config/supabase');

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().neq('id', 0);
  if (error) {
    throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

async function resetSettings() {
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, daily_limit: 0, balance: 0, monthly_savings_goal: 0 }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to reset settings: ${error.message}`);
  }
}

async function clearDb() {
  await clearTable('lend');
  await clearTable('income');
  await clearTable('savings');
  await clearTable('fuel');
  await clearTable('expenses');
  await resetSettings();
}

clearDb()
  .then(() => {
    console.log('Database cleared successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
