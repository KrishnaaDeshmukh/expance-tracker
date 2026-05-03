import { useEffect, useState } from 'react';
import { Stack, Skeleton, Alert, Grid } from '@mui/material';
import client from '../api/client';
import LendForm from '../components/LendForm';
import LendSummary from '../components/LendSummary';
import LendHistoryTable from '../components/LendHistoryTable';

const LendTrackerPage = ({ onLendUpdated }) => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ totalGiven: 0, activeLendAmount: 0, returnedAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const loadLendData = async () => {
    setLoading(true);
    try {
      const [entriesResponse, statsResponse] = await Promise.all([
        client.get('/lend'),
        client.get('/lend/summary'),
      ]);

      setEntries(entriesResponse.data.data || []);
      setStats(statsResponse.data.data || {});
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load lend data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLendData();
  }, []);

  const handleLendCreated = async (payload) => {
    setMessage(payload.message || 'Lend entry saved');
    setMessageType('success');
    await loadLendData();
    onLendUpdated?.(payload);
  };

  const handleMarkReturned = async (entry) => {
    try {
      await client.patch(`/lend/${entry._id || entry.id}`);
      setMessage('Marked as returned');
      setMessageType('success');
      await loadLendData();
      onLendUpdated?.({ message: 'Lend returned' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to mark returned');
      setMessageType('error');
    }
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
          <LendForm onLendCreated={handleLendCreated} />
        </Grid>
        <Grid item xs={12} md={7}>
          <LendSummary stats={stats} />
        </Grid>
        <Grid item xs={12}>
          <LendHistoryTable entries={entries} onMarkReturned={handleMarkReturned} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default LendTrackerPage;
