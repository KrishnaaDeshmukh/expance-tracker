import React, { useState } from 'react';
import { Card, CardHeader, CardContent, TextField, Button, Box, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import client from '../api/client';

const LendForm = ({ onLendCreated }) => {
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const parsedAmount = parseFloat(formData.amount);
      if (!formData.personName.trim()) {
        throw new Error('Person name is required');
      }
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const response = await client.post('/api/lend', {
        personName: formData.personName.trim(),
        amount: parsedAmount,
        date: formData.date,
        note: formData.note,
      });

      setSuccess('Lend entry added successfully');
      setFormData({
        personName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
      onLendCreated?.(response.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add lend entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Lend Money" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField label="Person Name" name="personName" value={formData.personName} onChange={handleChange} required fullWidth />
          <TextField
            label="Amount (Rs)"
            name="amount"
            type="number"
            inputProps={{ min: '0.01', step: '0.01' }}
            value={formData.amount}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Note (Optional)"
            name="note"
            value={formData.note}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <Button type="submit" variant="contained" color="warning" startIcon={<PersonAddIcon />} disabled={loading}>
            {loading ? 'Saving...' : 'Record Lend'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LendForm;
