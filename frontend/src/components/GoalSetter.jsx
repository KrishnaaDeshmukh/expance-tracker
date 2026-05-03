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
import TargetIcon from '@mui/icons-material/EmojiEvents';
import client from '../api/client';

const GoalSetter = ({ currentGoal, onGoalUpdated }) => {
  const [goal, setGoal] = useState(currentGoal || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
    setError('');
  };

  const handleSetGoal = async () => {
    setError('');
    setSuccess('');

    try {
      if (!goal || parseFloat(goal) < 0) {
        throw new Error('Please enter a valid goal amount');
      }

      setLoading(true);

      await client.post('/savings/goal', {
        goal: parseFloat(goal),
      });

      setSuccess('Monthly savings goal updated successfully!');
      if (onGoalUpdated) {
        onGoalUpdated();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to set goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Monthly Savings Goal"
        avatar={<TargetIcon sx={{ color: '#f44336' }} />}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Monthly Goal (Rs)"
            type="number"
            inputProps={{ min: '0', step: '100' }}
            value={goal}
            onChange={handleGoalChange}
            fullWidth
            helper-text="Set your monthly savings target"
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSetGoal}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Setting Goal...' : 'Set Goal'}
          </Button>

          {currentGoal > 0 && (
            <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                Current Goal: <strong>Rs{parseFloat(currentGoal || 0).toFixed(2)}</strong>
              </span>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalSetter;
