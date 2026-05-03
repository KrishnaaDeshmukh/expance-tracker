import { Alert, Stack, Typography } from '@mui/material';

function LimitBanner({ summary }) {
  if (!summary?.settings?.dailyLimit) {
    return null;
  }

  if (!summary.warning) {
    return (
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        Daily spend is under control. Remaining budget: Rs{Number(summary.remainingDailyBudget || 0).toFixed(2)}.
      </Alert>
    );
  }

  return (
    <Alert severity="warning" sx={{ borderRadius: 3 }}>
      <Stack spacing={0.5}>
        <Typography fontWeight={700}>Daily limit exceeded</Typography>
        <Typography variant="body2">
          You have spent Rs{Number(summary.totals?.today || 0).toFixed(2)} against a limit of Rs
          {Number(summary.settings.dailyLimit || 0).toFixed(2)}.
        </Typography>
      </Stack>
    </Alert>
  );
}

export default LimitBanner;
