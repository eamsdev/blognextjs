import './globals.css';
import FullscreenContainer from '@components/FullscreenContainer';
import { CssBaseline } from '@mui/material';
import { ThemeWrapper } from '@themes/ThemeWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/profilePhoto.webp" as="image" />
      </head>
      <body>
        <ThemeWrapper>
          <CssBaseline />
          <FullscreenContainer>{children}</FullscreenContainer>
        </ThemeWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
