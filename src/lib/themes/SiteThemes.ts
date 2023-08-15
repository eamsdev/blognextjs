'use client';

import createTheme, { ThemeOptions } from '@mui/material/styles/createTheme';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const baseTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode: mode,
      divider: mode == 'light' ? 'rgba(0, 0, 0, 0.34)' : 'rgba(255, 255, 255, 0.34)',
      background: {
        paper: mode == 'light' ? '#fff' : '#090D1F',
        default: mode == 'light' ? '#fff' : '#090D1F',
      },
    },
    typography: {
      fontFamily: inter.style.fontFamily,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundImage: 'none',
            backgroundColor: mode == 'light' ? '#fff' : '#090D1F',
            color: mode == 'light' ? '#000' : '#fff',
          },
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            padding: 0,
            '@media (min-width: 0px)': {
              padding: 0,
            },
          },
        },
      },
    },
  };
};

export const lightTheme = createTheme({
  ...baseTheme('light'),
});

export const darkTheme = createTheme({
  ...baseTheme('dark'),
});
