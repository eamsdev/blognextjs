'use client';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { darkTheme, lightTheme } from '@themes/SiteThemes';
import React from 'react';

const ColorModeContext = React.createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  currentColorMode: 'light',
});

type ColorModeContextType = {
  toggleColorMode: () => void;
  currentColorMode: 'light' | 'dark';
};

const ThemeWrapper = ({ children }: React.PropsWithChildren) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      currentColorMode: mode,
    }),
    [mode],
  );

  const theme = React.useMemo(() => (mode == 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export { ThemeWrapper, ColorModeContext };
