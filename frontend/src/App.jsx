import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, Container, Alert, Snackbar } from '@mui/material';
import client from './api/client';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import FuelTrackerPage from './pages/FuelTrackerPage';

import SavingsTrackerPage from './pages/SavingsTrackerPage';
import IncomeTrackerPage from './pages/IncomeTrackerPage';
import LendTrackerPage from './pages/LendTrackerPage';

const initialDashboardState = {
  totals: {
    today: 0,
    week: 0,
    month: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    lendActive: 0,
    lendReturned: 0,
  },
  settings: { dailyLimit: 0, balance: 0 },
  remainingDailyBudget: 0,
  remainingBalance: 0,
  warning: false,
  recentTransactions: [],
};

function App() {
  const [summary, setSummary] = useState(initialDashboardState);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const loadData = async () => {
    setLoading(true);
    try {
      const summaryResponse = await client.get('/summary');

      setSummary(summaryResponse.data);
    } catch (error) {
      const responseMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      setMessage(responseMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExpenseCreated = async (payload) => {
    setMessage(payload.message || 'Expense saved');
    setMessageType(payload.warning ? 'warning' : 'success');
    await loadData();
  };

  const handleSettingsUpdated = async (payload) => {
    setMessage(payload.message || 'Settings updated');
    setMessageType('success');
    await loadData();
  };

  return (
    <Layout summary={summary} onRefresh={loadData}>
      <Box component="main" sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  loading={loading}
                  summary={summary}
                  onRefresh={loadData}
                />
              }
            />
            <Route
              path="/add"
              element={<AddExpensePage onExpenseCreated={handleExpenseCreated} onSettingsUpdated={handleSettingsUpdated} />}
            />
            <Route
              path="/fuel"
              element={<FuelTrackerPage onFuelEntryCreated={handleExpenseCreated} />}
            />
            <Route
              path="/savings"
              element={<SavingsTrackerPage onSavingsEntryCreated={handleExpenseCreated} />}
            />
            <Route
              path="/income"
              element={<IncomeTrackerPage onIncomeCreated={handleExpenseCreated} />}
            />
            <Route
              path="/lend"
              element={<LendTrackerPage onLendUpdated={handleExpenseCreated} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4500}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage('')} severity={messageType} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default App;
