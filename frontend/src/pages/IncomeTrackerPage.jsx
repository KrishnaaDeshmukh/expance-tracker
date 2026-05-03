import { useEffect, useState } from 'react';
import { Stack, Skeleton, Alert, Grid } from '@mui/material';
import client from '../api/client';
import IncomeForm from '../components/IncomeForm';
import IncomeSummary from '../components/IncomeSummary';
import IncomeHistoryTable from '../components/IncomeHistoryTable';

const IncomeTrackerPage = ({ onIncomeCreated }) => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, todayIncome: 0, monthIncome: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const loadIncomeData = async () => {
    setLoading(true);
    try {
      const [entriesResponse, statsResponse] = await Promise.all([
        client.get('/api/income'),
        client.get('/api/income/summary'),
      ]);

      setEntries(entriesResponse.data.data || []);
      setStats(statsResponse.data.data || {});
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load income data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomeData();
  }, []);

  const handleIncomeCreated = async (payload) => {
    setMessage(payload.message || 'Income saved');
    setMessageType('success');
    await loadIncomeData();
    onIncomeCreated?.(payload);
  };

  if (loading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={300} />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {message && (
        <Alert severity={messageType} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <IncomeForm onIncomeCreated={handleIncomeCreated} />
        </Grid>
        <Grid item xs={12} md={7}>
          <IncomeSummary stats={stats} />
        </Grid>
        <Grid item xs={12}>
          <IncomeHistoryTable entries={entries} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default IncomeTrackerPage;
