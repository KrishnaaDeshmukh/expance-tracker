import { Paper, Box, Grid, Typography } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FuelChart({ entries }) {
  if (!entries || entries.length < 2) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">Need at least 2 entries to display charts</Typography>
      </Paper>
    );
  }

  // Sort entries by date ascending for proper chart display
  const sortedEntries = [...entries].reverse();

  // Prepare chart data
  const chartData = sortedEntries.map((entry, index) => ({
    date: entry.date,
    mileage: entry.mileage ? Number(entry.mileage.toFixed(2)) : null,
    costPerKm: entry.costPerKm ? Number(entry.costPerKm.toFixed(2)) : null,
    amount: Number(entry.totalAmountSpent.toFixed(2)),
    odometer: Number(entry.odometerReading.toFixed(0)),
  }));

  // Calculate average mileage for reference line
  const mileages = chartData.filter((d) => d.mileage).map((d) => d.mileage);
  const avgMileage = mileages.length > 0 ? (mileages.reduce((a, b) => a + b, 0) / mileages.length).toFixed(2) : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Mileage Trend (km/L)
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mileage"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={{ fill: '#0f766e', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Mileage"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Cost Per Km Trend (Rs/km)
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="costPerKm"
                  stroke="#d32f2f"
                  strokeWidth={2}
                  dot={{ fill: '#d32f2f', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Cost Per Km"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Fuel Amount by Fill-up (Rs)
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" fill="#1976d2" name="Amount (Rs)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Odometer Progress (km)
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="odometer"
                  stroke="#388e3c"
                  strokeWidth={2}
                  dot={{ fill: '#388e3c', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Odometer"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default FuelChart;
