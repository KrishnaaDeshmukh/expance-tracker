import { Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import CallSplitIcon from '@mui/icons-material/CallSplit';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const items = [
  {
    key: 'income',
    title: 'Total Income',
    icon: TrendingUpIcon,
    tone: '#2563eb',
  },
  {
    key: 'expenses',
    title: 'Total Expenses',
    icon: PaymentsIcon,
    tone: '#ef4444',
  },
  {
    key: 'savings',
    title: 'Total Savings',
    icon: SavingsIcon,
    tone: '#16a34a',
  },
  {
    key: 'lendActive',
    title: 'Money Lent',
    icon: CallSplitIcon,
    tone: '#f97316',
  },
  {
    key: 'remainingBalance',
    title: 'Account Balance',
    icon: AccountBalanceIcon,
    tone: '#0f766e',
  },
  {
    key: 'month',
    title: 'This Month',
    icon: CalendarMonthIcon,
    tone: '#334155',
  },
];

function SummaryCards({ summary }) {
  return (
    <Grid container spacing={2.5}>
      {items.map((item) => {
        const Icon = item.icon;
        const value =
          item.key === 'month'
            ? summary?.totals?.month
            : item.key === 'remainingBalance'
              ? summary?.remainingBalance
              : summary?.totals?.[item.key];

        return (
          <Grid item xs={12} sm={6} lg={3} key={item.key}>
            <Card sx={{ height: '100%', borderTop: `4px solid ${item.tone}` }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h5">{formatMoney(value)}</Typography>
                  </div>
                  <Icon sx={{ color: item.tone, fontSize: 36 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default SummaryCards;
