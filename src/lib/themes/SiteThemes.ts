'use client';

import { AppBar, ThemeOptions, createTheme } from '@mui/material';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const baseTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: mode == 'light' ? '#fff' : '#000',
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
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  ...baseTheme('light'),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  ...baseTheme('dark'),
});
