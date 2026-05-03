import { useState } from 'react';
import { Box, Button, TextField, Grid, Stack, Alert } from '@mui/material';
import client from '../api/client';

const todayAsInputValue = () => new Date().toISOString().slice(0, 10);

function FuelForm({ onFuelEntryCreated }) {
  const [form, setForm] = useState({
    totalAmountSpent: '',
    pricePerLiter: '',
    litersFilled: '',
    odometerReading: '',
    date: todayAsInputValue(),
  });
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setLocalError('');
    setSaving(true);

    try {
      const payload = {
        totalAmountSpent: Number(form.totalAmountSpent),
        pricePerLiter: Number(form.pricePerLiter),
        litersFilled: form.litersFilled ? Number(form.litersFilled) : null,
        odometerReading: Number(form.odometerReading),
        date: form.date,
      };

      const response = await client.post('/fuel', payload);
      onFuelEntryCreated?.({
        ...response.data,
        message: 'Fuel entry added successfully',
      });
      setForm({
        totalAmountSpent: '',
        pricePerLiter: '',
        litersFilled: '',
        odometerReading: '',
        date: todayAsInputValue(),
      });
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Unable to save fuel entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={submitForm}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Total Amount Spent (Rs)"
          name="totalAmountSpent"
          type="number"
          inputProps={{ min: 0.01, step: 0.01 }}
          value={form.totalAmountSpent}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Price Per Liter (Rs/L)"
          name="pricePerLiter"
          type="number"
          inputProps={{ min: 0.01, step: 0.01 }}
          value={form.pricePerLiter}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Liters Filled (Optional - auto-calculated if empty)"
          name="litersFilled"
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          value={form.litersFilled}
          onChange={handleChange}
          helperText="Leave empty to auto-calculate from amount ÷ price"
        />

        <TextField
          fullWidth
          label="Odometer Reading (km)"
          name="odometerReading"
          type="number"
          inputProps={{ min: 0, step: 1 }}
          value={form.odometerReading}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {localError && <Alert severity="error">{localError}</Alert>}

        <Button type="submit" variant="contained" size="large" disabled={saving} fullWidth>
          {saving ? 'Saving...' : 'Add Fuel Entry'}
        </Button>
      </Stack>
    </Box>
  );
}

export default FuelForm;
