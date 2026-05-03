import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const formatShortDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function SpendingChart({ summary }) {
  const weeklyTrend = summary?.charts?.weeklyTrend || [];
  const monthlyTrend = summary?.charts?.monthlyTrend || [];
  const categoryData = (summary?.charts?.categorySummary || []).map((item) => ({
    name: item.category,
    total: item.total,
  }));
  const savingsTrend = summary?.charts?.savingsTrend || [];
  const incomeMonth = summary?.income?.monthIncome || 0;
  const expenseMonth = summary?.totals?.month || 0;

  const incomeExpenseData = [
    { name: 'This Month', Income: Number(incomeMonth || 0), Expenses: Number(expenseMonth || 0) },
  ];

  const normalizedSavingsTrend = savingsTrend.map((entry) => ({
    date: entry.date,
    total: entry.type === 'withdraw' ? -Number(entry.amount || 0) : Number(entry.amount || 0),
  }));

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      <Card>
        <CardContent sx={{ height: { xs: 320, md: 420 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Daily Spending (Last 7 Days)
          </Typography>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={formatShortDate} />
              <YAxis tickFormatter={(value) => `Rs${value}`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ height: { xs: 320, md: 420 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Spending by Category
          </Typography>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(value) => `Rs${value}`} />
              <YAxis type="category" dataKey="name" width={90} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="total" fill="#f97316" radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ height: { xs: 320, md: 420 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Monthly Spending Trend
          </Typography>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={formatShortDate} />
              <YAxis tickFormatter={(value) => `Rs${value}`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ height: { xs: 320, md: 420 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Income vs Expenses (This Month)
          </Typography>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `Rs${value}`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
              <Bar dataKey="Income" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ height: { xs: 320, md: 420 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Savings Trend (Net)
          </Typography>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={normalizedSavingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={formatShortDate} />
              <YAxis tickFormatter={(value) => `Rs${value}`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SpendingChart;
