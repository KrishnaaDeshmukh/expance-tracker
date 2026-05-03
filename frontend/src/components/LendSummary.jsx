import React from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const LendSummary = ({ stats }) => {
  return (
    <Card>
      <CardHeader title="Lend Summary" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(249, 115, 22, 0.12)' }}>
              <Typography variant="body2" color="text.secondary">Active Lend</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.activeLendAmount)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(14, 165, 233, 0.12)' }}>
              <Typography variant="body2" color="text.secondary">Returned</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.returnedAmount)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(107, 114, 128, 0.12)' }}>
              <Typography variant="body2" color="text.secondary">Total Given</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{formatMoney(stats.totalGiven)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LendSummary;
