import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: '"GeneralSans", "VelaSans", "-apple-system", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#c27fc2',
    },
    success: {
      main: '#6ca878',
    },
    error: {
      main: '#e45a4d',
    },
    text: {
      primary: '#292929',
      secondary: '#696969',
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-info)',
          '&:hover': {
            backgroundColor: 'var(--color-info)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-bg-main)',
          color: 'var(--color-text-primary)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#f0f0f0', 
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          width: '100%',
          height: '54px',
          borderRadius: 10,
          fontWeight: 500,
        },

        contained: {
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-white)',
          '& .MuiSvgIcon-root': { fill: 'var(--color-white)' },
          '&:hover': { backgroundColor: 'var(--color-gray-black)' },
          '&.Mui-disabled': {
            backgroundColor: 'var(--color-gray-light)',
            color: 'var(--color-text-secondary)',
            '& .MuiSvgIcon-root': { fill: 'var(--color-text-secondary)' },
          },
        },

        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-black)',
          border: '2px solid currentColor',
          '& .MuiSvgIcon-root': { fill: 'currentColor' },
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        },
      },
      variants: [
        {
          props: { variant: 'outlined', disabled: true },
          style: {
            color: 'var(--color-gray-light)',
            borderColor: 'var(--color-gray-light)',
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-input': {
            border: '1px solid var(--color-invisible)',
            width: '100%',
            fontWeight: 500,
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            '&.Mui-disabled': {
              WebkitTextFillColor: 'var(--color-text-primary)',
              color: 'var(--color-text-primary)',
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#070732',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          background: 'var(--color-bg-main)',
          padding: '0 12px',
          transition: '0.2s',
          fontSize: '1.25rem',
          borderRadius: 4,
          '&.Mui-disabled': {
            transition: '0.2s',
            // fontSize: '1rem',
            background: 'var(--color-bg-main)',
            padding: '0 6px',
            color: 'var(--color-text-secondary)',
            opacity: 0.6,
          },
          '&.Mui-focused.Mui-focused': {
            color: '#070732',
          },
        },
      },
    },
  },
});
