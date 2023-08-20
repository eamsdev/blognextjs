import { darkTheme } from '../lib/themes/SiteThemes';
import './globals.css';
import Footer from '@components/Footer';
import FullscreenContainer from '@components/FullscreenContainer';
import Header from '@components/Header';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pete Eamsuwan's Software Development Blog",
  description:
    "Pete Eamsuwan's Software Development Blog. Here I cover software architecture, design, devops as well as some tips and tricks.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/profilePhoto.webp" as="image" />
      </head>
      <body>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <FullscreenContainer>
            <Container>
              <Header />
              {children}
              <Footer />
            </Container>
          </FullscreenContainer>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
