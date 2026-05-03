import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

const SavingsHistoryTable = ({ entries }) => {
  const formatAmount = (amount, type) => {
    const value = parseFloat(amount || 0).toFixed(2);
    return `${type === 'withdraw' ? '-' : ''}Rs${value}`;
  };

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">
            No savings entries yet
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Savings History"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ fontSize: '0.875rem' }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Amount (Rs)
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow
                  key={entry.id || index}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    {entry.date}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, textTransform: 'capitalize' }}>
                    {entry.type || 'add'}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      color: entry.type === 'withdraw' ? '#ef4444' : '#4caf50',
                    }}
                  >
                    {formatAmount(entry.amount, entry.type)}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    {entry.note ? (
                      <Box
                        sx={{
                          backgroundColor: '#f5f5f5',
                          p: 1,
                          borderRadius: 0.5,
                          fontSize: '0.8rem',
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.note}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default SavingsHistoryTable;
