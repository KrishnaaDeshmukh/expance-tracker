import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Stack,
  Chip,
} from '@mui/material';

function FuelHistoryTable({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No fuel entries yet</Typography>
      </Paper>
    );
  }

  const getMileageColor = (mileage) => {
    if (!mileage) return 'default';
    if (mileage >= 12) return 'success';
    if (mileage >= 8) return 'primary';
    return 'warning';
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h6">Fuel Entry History</Typography>
        <Typography variant="body2" color="text.secondary">
          {entries.length} entries recorded
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)' }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Amount (Rs)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Price/L (Rs)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Liters
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Odometer (km)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Mileage (km/L)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Cost/km (Rs)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry._id} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}>
                <TableCell sx={{ fontSize: '0.875rem' }}>{entry.date}</TableCell>
                <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                  {entry.totalAmountSpent.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                  {entry.pricePerLiter.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                  {entry.litersFilled.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                  {entry.odometerReading.toFixed(0)}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                  {entry.mileage ? (
                    <Chip
                      label={`${entry.mileage.toFixed(2)}`}
                      size="small"
                      color={getMileageColor(entry.mileage)}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                  {entry.costPerKm ? entry.costPerKm.toFixed(2) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default FuelHistoryTable;
