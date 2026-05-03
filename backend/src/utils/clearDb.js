const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const supabase = require('../config/supabase');

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().gte('id', 1);
  if (error) {
    if (error.message.includes("Could not find the table")) {
      console.log(`Skipped ${table}: table does not exist yet`);
      return;
    }
    throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

async function resetSettings() {
  const primaryPayload = { id: 1, daily_limit: 0, balance: 0, monthly_savings_goal: 0 };
  const fallbackPayload = { id: 1, daily_limit: 0, balance: 0 };

  let { error } = await supabase.from('settings').upsert(primaryPayload, { onConflict: 'id' });

  if (error && error.message.includes("monthly_savings_goal")) {
    ({ error } = await supabase.from('settings').upsert(fallbackPayload, { onConflict: 'id' }));
  }

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
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
