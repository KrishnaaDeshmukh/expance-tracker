import { Box, Paper, Stack, Typography, Grid } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function FuelStats({ stats }) {
  if (!stats) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No fuel data available yet</Typography>
      </Paper>
    );
  }

  const statItems = [
    {
      icon: DirectionsCarIcon,
      label: 'Latest Mileage',
      value: stats.latestMileage ? `${stats.latestMileage.toFixed(2)} km/L` : 'N/A',
      color: 'primary',
    },
    {
      icon: LocalGasStationIcon,
      label: 'Average Mileage',
      value: stats.averageMileage ? `${stats.averageMileage.toFixed(2)} km/L` : 'N/A',
      color: 'success',
    },
    {
      icon: TrendingDownIcon,
      label: 'Cost Per Km',
      value: stats.overallCostPerKm ? `Rs ${stats.overallCostPerKm.toFixed(2)}/km` : 'N/A',
      color: 'warning',
    },
  ];

  return (
    <Stack spacing={2}>
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Paper
            key={index}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: `${item.color}.lighter`,
                color: `${item.color}.main`,
              }}
            >
              <IconComponent sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.value}
              </Typography>
            </Box>
          </Paper>
        );
      })}

      <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: 'rgba(15, 118, 110, 0.04)' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Entries
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {stats.totalEntries}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Fuel Cost
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              Rs {stats.totalFuelCost.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Liters
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5 }}>
              {stats.totalLitersFilled.toFixed(2)} L
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {stats.latestMileage && stats.latestMileage < 8 && (
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 600 }}>
            ⚠️ Low Mileage Warning
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Your current mileage is below 8 km/L. Consider servicing your vehicle.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}

export default FuelStats;
