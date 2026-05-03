import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#f3f7f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#10221f',
      secondary: '#4b5e59',
    },
    error: {
      main: '#b91c1c',
    },
    warning: {
      main: '#b45309',
    },
    success: {
      main: '#15803d',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background:
            radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 30%),
            radial-gradient(circle at top right, rgba(249, 115, 22, 0.14), transparent 24%),
            linear-gradient(180deg, #eef5f3 0%, #f7faf9 50%, #eef4f2 100%);
          min-height: 100vh;
        }
        * {
          box-sizing: border-box;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 18px 48px rgba(16, 34, 31, 0.08)',
        },
      },
    },
  },
});

export default theme;
