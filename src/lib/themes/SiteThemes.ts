'use client';

import { createTheme } from '@mui/material';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});
