import React from 'react';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const formatMoney = (value) => `Rs${Number(value || 0).toFixed(2)}`;

const LendHistoryTable = ({ entries, onMarkReturned }) => {
  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="textSecondary">No lend entries yet</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Lend History" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Person</TableCell>
                <TableCell align="right">Amount (Rs)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id || entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.personName}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatMoney(entry.amount)}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{entry.status}</TableCell>
                  <TableCell>{entry.note || '—'}</TableCell>
                  <TableCell align="right">
                    {entry.status !== 'returned' ? (
                      <Button size="small" variant="outlined" onClick={() => onMarkReturned(entry)}>
                        Mark Returned
                      </Button>
                    ) : (
                      '—'
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

export default LendHistoryTable;
