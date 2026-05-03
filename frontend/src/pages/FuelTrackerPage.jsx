import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography, Skeleton, Alert } from '@mui/material';
import client from '../api/client';
import FuelForm from '../components/FuelForm';
import FuelStats from '../components/FuelStats';
import FuelHistoryTable from '../components/FuelHistoryTable';
import FuelChart from '../components/FuelChart';

function FuelTrackerPage({ onFuelEntryCreated }) {
  const [fuelEntries, setFuelEntries] = useState([]);
  const [fuelStats, setFuelStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const loadFuelData = async () => {
    setLoading(true);
    try {
      const [entriesResponse, statsResponse] = await Promise.all([
        client.get('/fuel'),
        client.get('/fuel/average'),
      ]);

      setFuelEntries(entriesResponse.data.data || []);
      setFuelStats(statsResponse.data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load fuel data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuelData();
  }, []);

  const handleFuelEntryCreated = async (payload) => {
    setMessage(payload.message || 'Fuel entry saved successfully');
    setMessageType('success');
    await loadFuelData();
    onFuelEntryCreated?.(payload);
  };

  if (loading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={200} />
        <Skeleton variant="rounded" height={300} />
        <Skeleton variant="rounded" height={400} />
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

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Fuel Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Track your fuel consumption, mileage, and cost efficiency to optimize your driving expenses.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FuelForm onFuelEntryCreated={handleFuelEntryCreated} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FuelStats stats={fuelStats} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <FuelChart entries={fuelEntries} />

      <FuelHistoryTable entries={fuelEntries} onRefresh={loadFuelData} />
    </Stack>
  );
}

export default FuelTrackerPage;
