import { AppBar, Box, Button, Toolbar, Typography, Container, Stack, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Add Expense', to: '/add' },
  { label: 'Fuel Tracker', to: '/fuel' },
  { label: 'Savings Tracker', to: '/savings' },
  { label: 'Income Tracker', to: '/income' },
  { label: 'Lend Tracker', to: '/lend' },
];

function Layout({ summary, onRefresh, children }) {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(14px)',
          backgroundColor: 'rgba(255, 255, 255, 0.76)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(16, 34, 31, 0.08)',
        }}
      >
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                Finance Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily budget, account balance, and spending overview
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant={active ? 'contained' : 'text'}
                  color={active ? 'primary' : 'inherit'}
                  sx={{ borderRadius: 999 }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button onClick={onRefresh} variant="outlined" sx={{ borderRadius: 999 }}>
              Refresh
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip label={`Today: Rs${summary?.totals?.today?.toFixed?.(2) ?? '0.00'}`} color="primary" variant="outlined" />
          <Chip
            label={
              summary?.settings?.dailyLimit
                ? `Daily limit: Rs${summary.settings.dailyLimit.toFixed(2)}`
                : 'Daily limit not set'
            }
            color="secondary"
            variant="outlined"
          />
          <Chip
            label={`Balance: Rs${Number(summary?.remainingBalance || 0).toFixed(2)}`}
            color="success"
            variant="outlined"
          />
        </Stack>
      </Container>

      {children}
    </Box>
  );
}

export default Layout;
