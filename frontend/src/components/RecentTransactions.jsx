import { Card, CardContent, Typography, Stack, Chip, Divider, List, ListItem, ListItemText, Avatar } from '@mui/material';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

function RecentTransactions({ transactions }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="h6">Recent Transactions</Typography>
          <Chip label={`${transactions.length} items`} variant="outlined" />
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        <List disablePadding>
          {transactions.map((transaction) => (
            <ListItem key={transaction._id} disableGutters sx={{ py: 1.1 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {transaction.category?.charAt(0)?.toUpperCase?.() || '$'}
              </Avatar>
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {transaction.category}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="error.main">
                      -{formatMoney(transaction.amount)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.description || 'No description'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
          {transactions.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No transactions yet.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;
