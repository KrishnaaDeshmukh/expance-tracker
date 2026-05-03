import React from 'react';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const IncomeHistoryTable = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">No income entries yet</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Income History" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Source</TableCell>
                <TableCell align="right">Amount (Rs)</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id || entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.source}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                    {formatMoney(entry.amount)}
                  </TableCell>
                  <TableCell>{entry.note || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeHistoryTable;
