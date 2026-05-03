import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TargetIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const SavingsSummary = ({ stats }) => {
  const formatAmount = (amount) => `Rs${parseFloat(amount || 0).toFixed(2)}`;

  const getGoalStatus = () => {
    if (stats.monthlyGoal === 0) return 'No goal set';
    if (stats.goalProgress >= 100) return '✅ Goal Achieved!';
    return `${Math.round(stats.goalProgress)}% of goal`;
  };

  const getGoalColor = () => {
    if (stats.monthlyGoal === 0) return 'default';
    if (stats.goalProgress >= 100) return 'success';
    if (stats.goalProgress >= 50) return 'primary';
    return 'warning';
  };

  return (
    <Card>
      <CardHeader
        title="Savings Summary"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {/* Total Savings Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Total Saved
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {formatAmount(stats.totalSavings)}
              </Typography>
            </Box>
          </Grid>

          {/* Today's Savings */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalAtmIcon sx={{ color: '#2196f3', fontSize: 24 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Today
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {formatAmount(stats.todaysSavings)}
              </Typography>
            </Box>
          </Grid>

          {/* Monthly Savings */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarMonthIcon sx={{ color: '#ff9800', fontSize: 24 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  This Month
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {formatAmount(stats.monthlySavings)}
              </Typography>
            </Box>
          </Grid>

          {/* Monthly Goal */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TargetIcon sx={{ color: '#f44336', fontSize: 24 }} />
                <Typography variant="subtitle2" color="textSecondary">
                  Goal
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {formatAmount(stats.monthlyGoal)}
              </Typography>
            </Box>
          </Grid>

          {/* Monthly Goal Progress */}
          {stats.monthlyGoal > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Monthly Progress
                  </Typography>
                  <Chip
                    label={getGoalStatus()}
                    color={getGoalColor()}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(stats.goalProgress, 100)}
                  sx={{ height: 10, borderRadius: 1, mb: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {formatAmount(stats.monthlySavings)} / {formatAmount(stats.monthlyGoal)}
                  {stats.remainingToGoal > 0 && (
                    <> • {formatAmount(stats.remainingToGoal)} remaining</>
                  )}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SavingsSummary;
