import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SavingsChart = ({ monthlyData, allEntries }) => {
  // Prepare data for charts
  const chartData = (allEntries || [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: entry.date,
      amount: entry.type === 'withdraw' ? -parseFloat(entry.amount) : parseFloat(entry.amount),
    }));

  // Calculate cumulative savings
  let cumulativeSum = 0;
  const cumulativeData = chartData.map((item) => {
    cumulativeSum += item.amount;
    return {
      ...item,
      cumulative: cumulativeSum,
    };
  });

  // Monthly breakdown (if available)
  const monthlyChartData = monthlyData.entries
    ? (monthlyData.entries || [])
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((entry) => ({
          date: entry.date,
          amount: entry.type === 'withdraw' ? -parseFloat(entry.amount) : parseFloat(entry.amount),
        }))
    : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: '#fff', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="caption">
            {`Rs${payload[0].value.toFixed(2)}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if ((chartData.length < 2 && monthlyChartData.length < 2) || chartData.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            Need at least 2 savings entries to display charts
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Savings Trends & Analysis"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Daily Savings Amount */}
          {chartData.length >= 2 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Net Savings by Day
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          )}

          {/* Cumulative Savings Trend */}
          {cumulativeData.length >= 2 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Cumulative Savings Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#4caf50"
                    fillOpacity={1}
                    fill="url(#colorCumulative)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          )}

          {/* Monthly Progress Line Chart */}
          {monthlyChartData.length >= 1 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                This Month's Savings Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2196f3"
                    dot={{ fill: '#2196f3', r: 4 }}
                    connectNulls
                    name="Daily Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          )}

          {/* Monthly Goal Progress */}
          {monthlyData && monthlyData.monthlyGoal > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Monthly Goal Tracking
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      {
                        name: 'Goal Progress',
                        Saved: Math.min(monthlyData.totalSavings, monthlyData.monthlyGoal),
                        Remaining: Math.max(0, monthlyData.monthlyGoal - monthlyData.totalSavings),
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Saved" stackId="a" fill="#4caf50" />
                    <Bar dataKey="Remaining" stackId="a" fill="#e0e0e0" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SavingsChart;
