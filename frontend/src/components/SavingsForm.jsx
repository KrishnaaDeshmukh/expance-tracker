import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import client from '../api/client';

const SavingsForm = ({ onSavingsEntryCreated }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'add',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!formData.date) {
        throw new Error('Date is required');
      }

      const response = await client.post('/savings', {
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date,
        note: formData.note,
      });

      setSuccess('Savings entry added successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        type: 'add',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });

      if (onSavingsEntryCreated) {
        onSavingsEntryCreated(response.data.data);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add savings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Add Daily Savings"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Type"
            name="type"
            select
            SelectProps={{ native: true }}
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            <option value="add">Add Savings</option>
            <option value="withdraw">Withdraw Savings</option>
          </TextField>

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
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., Saved from bonus, Extra income..."
          />

          <Button
            type="submit"
            variant="contained"
            color={formData.type === 'withdraw' ? 'warning' : 'success'}
            startIcon={<SaveIcon />}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Saving...' : formData.type === 'withdraw' ? 'Withdraw Savings' : 'Add Savings'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SavingsForm;
