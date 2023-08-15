import './globals.css';
import Footer from '@components/Footer';
import FullscreenContainer from '@components/FullscreenContainer';
import Header from '@components/Header';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
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
          <FullscreenContainer>
            <Container>
              <Header />
              {children}
              <Footer />
            </Container>
          </FullscreenContainer>
        </ThemeWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
