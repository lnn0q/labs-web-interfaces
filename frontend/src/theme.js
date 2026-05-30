import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B00',
      light: '#FF8C38',
      dark: '#CC5500',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFD700',
      light: '#FFE44D',
      dark: '#CCB000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    error: {
      main: '#FF4444',
    },
    success: {
      main: '#4CAF50',
    },
    divider: 'rgba(255, 107, 0, 0.12)',
  },
  typography: {
    fontFamily: "'Outfit', 'Noto Sans JP', sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255, 107, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF8C38 0%, #FFD700 100%)',
          },
        },
        outlined: {
          borderColor: '#FF6B00',
          '&:hover': {
            borderColor: '#FF8C38',
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(42, 42, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 0, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(255, 107, 0, 0.3)',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(255, 107, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 107, 0, 0.3)',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: '#FF6B00',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF8C38',
              boxShadow: '0 0 0 3px rgba(255, 107, 0, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 107, 0, 0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#1E1E1E',
          borderRight: '1px solid rgba(255, 107, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 0, 0.15)',
          borderRadius: 20,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(255, 107, 0, 0.3)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(42, 42, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
          borderRadius: 8,
          fontSize: '0.8rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        },
      },
    },
  },
});

export default theme;
