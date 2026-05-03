import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Grid,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const SavingsVsSpending = ({ savings, spending }) => {
  const formatAmount = (amount) => `Rs${parseFloat(amount || 0).toFixed(2)}`;

  // Prepare data for charts
  const todayData = [
    {
      name: 'Today',
      Savings: parseFloat(savings.todaysSavings || 0),
      Spending: parseFloat(spending.todaysSpending || 0),
    },
  ];

  const monthlyData = [
    {
      name: 'This Month',
      Savings: parseFloat(savings.monthlySavings || 0),
      Spending: parseFloat(spending.monthlySpending || 0),
    },
  ];

  // Determine if good or overspending (Today)
  const todaysGood = savings.todaysSavings > spending.todaysSpending;
  const todayMessage = todaysGood ? 'Good job! 💪' : 'Watch your spending 📊';
  const todayColor = todaysGood ? 'success' : 'warning';

  // Determine if good or overspending (Monthly)
  const monthlyGood = savings.monthlySavings > spending.monthlySpending;
  const monthlyMessage = monthlyGood ? 'Excellent progress! 🎉' : 'Overspending detected 📉';
  const monthlyColor = monthlyGood ? 'success' : 'error';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: '#fff', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="caption">{`${payload[0].name}: Rs${payload[0].value.toFixed(2)}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader
        title="Savings vs Spending Analysis"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Today's Comparison */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Today
                </Typography>
                <Chip
                  label={todayMessage}
                  color={todayColor}
                  size="small"
                  icon={todaysGood ? <TrendingUpIcon /> : <TrendingDownIcon />}
                />
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={todayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Savings" fill="#4caf50" />
                  <Bar dataKey="Spending" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Saved
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {formatAmount(savings.todaysSavings)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Spent
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    {formatAmount(spending.todaysSpending)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Monthly Comparison */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  This Month
                </Typography>
                <Chip
                  label={monthlyMessage}
                  color={monthlyColor}
                  size="small"
                  icon={monthlyGood ? <TrendingUpIcon /> : <TrendingDownIcon />}
                />
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Savings" fill="#4caf50" />
                  <Bar dataKey="Spending" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Saved
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {formatAmount(savings.monthlySavings)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Spent
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    {formatAmount(spending.monthlySpending)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Insights */}
          <Grid item xs={12}>
            <Alert severity={todayColor} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                Today's Insight:
              </Typography>
              {todaysGood
                ? `You saved Rs${(savings.todaysSavings - spending.todaysSpending).toFixed(2)} more than you spent today!`
                : `You spent Rs${(spending.todaysSpending - savings.todaysSavings).toFixed(2)} more than you saved today.`}
            </Alert>
            <Alert severity={monthlyColor}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                Monthly Insight:
              </Typography>
              {monthlyGood
                ? `Excellent! You've saved Rs${(savings.monthlySavings - spending.monthlySpending).toFixed(2)} more than you spent this month!`
                : `This month, you've spent Rs${(spending.monthlySpending - savings.monthlySavings).toFixed(2)} more than you saved.`}
            </Alert>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SavingsVsSpending;
