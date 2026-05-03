import React from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const IncomeSummary = ({ stats }) => {
  return (
    <Card>
      <CardHeader title="Income Summary" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(34, 197, 94, 0.1)' }}>
              <Typography variant="body2" color="text.secondary">Total Income</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.totalIncome)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
              <Typography variant="body2" color="text.secondary">Today</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.todayIncome)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15, 118, 110, 0.1)' }}>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.monthIncome)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default IncomeSummary;
