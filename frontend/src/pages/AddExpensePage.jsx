import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import client from '../api/client';

const categories = ['Food', 'Transport', 'Bills', 'Groceries', 'Entertainment', 'Shopping', 'Health', 'Other'];

const todayAsInputValue = () => new Date().toISOString().slice(0, 10);

function AddExpensePage({ onExpenseCreated, onSettingsUpdated }) {
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: todayAsInputValue(),
  });
  const [settings, setSettings] = useState({
    dailyLimit: '',
    initialBalance: '',
  });
  const [savingExpense, setSavingExpense] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleExpenseChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSettingsChange = (event) => {
    setSettings((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitExpense = async (event) => {
    event.preventDefault();
    setLocalError('');
    setSavingExpense(true);

    try {
      const response = await client.post('/expenses', {
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date,
      });
      onExpenseCreated?.(response.data);
      setForm({ amount: '', category: 'Food', description: '', date: todayAsInputValue() });
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Unable to save expense');
    } finally {
      setSavingExpense(false);
    }
  };

  const submitSettings = async (event) => {
    event.preventDefault();
    setLocalError('');
    setSavingSettings(true);

    try {
      const payload = {
        dailyLimit: Number(settings.dailyLimit),
      };

      if (settings.initialBalance !== '') {
        payload.balance = Number(settings.initialBalance);
      }

      const response = await client.post('/limit', payload);
      onSettingsUpdated?.(response.data);
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Unable to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <Card>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Add Expense
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Record a daily expense and it will immediately adjust your balance and dashboard totals.
            </Typography>

            <Box component="form" onSubmit={submitExpense}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    inputProps={{ min: 0.01, step: 0.01 }}
                    value={form.amount}
                    onChange={handleExpenseChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={handleExpenseChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleExpenseChange}
                    placeholder="Optional note about this expense"
                    multiline
                    minRows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleExpenseChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  {localError ? <Alert severity="error">{localError}</Alert> : null}
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large" disabled={savingExpense}>
                    {savingExpense ? 'Saving...' : 'Save Expense'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Budget Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set a daily limit and initialize your account balance.
            </Typography>

            <Box component="form" onSubmit={submitSettings}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Daily Limit"
                  name="dailyLimit"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={settings.dailyLimit}
                  onChange={handleSettingsChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Initial Balance"
                  name="initialBalance"
                  type="number"
                  inputProps={{ step: 0.01 }}
                  value={settings.initialBalance}
                  onChange={handleSettingsChange}
                  helperText="Optional if you only want to update the daily limit"
                />
                <Divider />
                {localError ? <Alert severity="error">{localError}</Alert> : null}
                <Button type="submit" variant="outlined" size="large" disabled={savingSettings}>
                  {savingSettings ? 'Updating...' : 'Save Settings'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AddExpensePage;
