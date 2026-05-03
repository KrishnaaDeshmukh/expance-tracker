import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, Grid } from '@mui/material';
import client from '../api/client';
import SavingsForm from '../components/SavingsForm';
import SavingsSummary from '../components/SavingsSummary';
import SavingsChart from '../components/SavingsChart';
import SavingsVsSpending from '../components/SavingsVsSpending';
import SavingsHistoryTable from '../components/SavingsHistoryTable';
import GoalSetter from '../components/GoalSetter';

const SavingsTrackerPage = () => {
  const [savingsEntries, setSavingsEntries] = useState([]);
  const [savingsStats, setSavingsStats] = useState({
    totalSavings: 0,
    todaysSavings: 0,
    monthlySavings: 0,
    monthlyGoal: 0,
    remainingToGoal: 0,
    goalProgress: 0,
  });
  const [monthlyData, setMonthlyData] = useState({
    entries: [],
    totalSavings: 0,
    monthlyGoal: 0,
    remainingToGoal: 0,
    goalProgress: 0,
  });
  const [spendingStats, setSpendingStats] = useState({
    todaysSpending: 0,
    monthlySpending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    loadSavingsData();
    loadSpendingData();
  }, []);

  const loadSavingsData = async () => {
    try {
      setLoading(true);
      const [entriesRes, statsRes, monthlyRes] = await Promise.all([
        client.get('/savings?limit=10'),
        client.get('/savings/summary'),
        client.get('/savings/monthly'),
      ]);

      setSavingsEntries(entriesRes.data.data || entriesRes.data.entries || []);
      setSavingsStats(statsRes.data.data || statsRes.data || {});
      setMonthlyData(monthlyRes.data.data || monthlyRes.data || {});
    } catch (error) {
      setMessage('Failed to load savings data');
      setMessageType('error');
      console.error('Error loading savings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpendingData = async () => {
    try {
      const response = await client.get('/summary');
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's spending
      const todayResponse = await client.get(`/expenses?date=${today}`);
      const todayExpenses = todayResponse.data.expenses || todayResponse.data.data || [];
      const todaysSpending = todayExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      // Get current month spending (from summary)
      const currentMonthSpending = response.data.totals?.month || response.data.data?.totals?.month || 0;

      setSpendingStats({
        todaysSpending,
        monthlySpending: currentMonthSpending,
      });
    } catch (error) {
      console.error('Error loading spending data:', error);
      setSpendingStats({
        todaysSpending: 0,
        monthlySpending: 0,
      });
    }
  };

  const handleSavingsEntryCreated = async (newEntry) => {
    setMessage('Savings entry added successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
    await loadSavingsData();
  };

  const handleGoalUpdated = async () => {
    setMessage('Savings goal updated successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
    await loadSavingsData();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Savings Form */}
        <Grid item xs={12} md={6}>
          <SavingsForm onSavingsEntryCreated={handleSavingsEntryCreated} />
        </Grid>

        {/* Goal Setter */}
        <Grid item xs={12} md={6}>
          <GoalSetter
            currentGoal={savingsStats.monthlyGoal}
            onGoalUpdated={handleGoalUpdated}
          />
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12}>
          <SavingsSummary stats={savingsStats} />
        </Grid>

        {/* Savings vs Spending */}
        <Grid item xs={12}>
          <SavingsVsSpending
            savings={savingsStats}
            spending={spendingStats}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <SavingsChart monthlyData={monthlyData} allEntries={savingsEntries} />
        </Grid>

        {/* History Table */}
        <Grid item xs={12}>
          <SavingsHistoryTable entries={savingsEntries} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SavingsTrackerPage;
