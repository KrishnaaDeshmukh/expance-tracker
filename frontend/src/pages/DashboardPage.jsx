import { Box, Grid, Paper, Stack, Typography, Skeleton } from '@mui/material';
import SummaryCards from '../components/SummaryCards';
import SpendingChart from '../components/SpendingChart';
import RecentTransactions from '../components/RecentTransactions';
import LimitBanner from '../components/LimitBanner';

function DashboardPage({ loading, summary }) {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={420} />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5, overflow: 'hidden' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
              Personal finance dashboard
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
              Stay ahead of daily spending without losing sight of your cash balance.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
              Track expenses by day, week, and month. Set a daily limit, monitor your bank balance, and get a warning
              when spending goes over plan.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: 'rgba(15, 118, 110, 0.08)',
                border: '1px solid rgba(15, 118, 110, 0.12)',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Remaining balance
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.8 }}>
                Rs{Number(summary.remainingBalance || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily budget left: Rs{Number(summary.remainingDailyBudget || 0).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <LimitBanner summary={summary} />
      <SummaryCards summary={summary} />
      <SpendingChart summary={summary} />
      <RecentTransactions transactions={summary.recentTransactions || []} />
    </Stack>
  );
}

export default DashboardPage;
