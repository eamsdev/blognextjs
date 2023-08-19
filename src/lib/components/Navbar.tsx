'use client';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

const navItems = [
  {
    label: 'Blog',
    link: '/',
  },
  {
    label: 'About',
    link: '/about',
  },
  {
    label: 'Contact',
    link: '/contact',
  },
];

export default function NavBar() {
  const toolbarStyles = {
    marginY: '10px',
    flexDirection: {
      xs: 'row-reverse',
      sm: 'row',
    },
  };

  return (
    <Box component="header">
      <AppBar component="nav">
        <Container sx={{ overflowX: 'visible' }}>
          <Toolbar sx={toolbarStyles}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => {}}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Button
                disableRipple
                onClick={() => (location.href = '/')}
                sx={{
                  padding: 0,
                  fontSize: '20px',
                  fontWeight: '400 !important',
                  color: 'text.primary',
                  textTransform: 'none',
                  ':hover': {
                    backgroundColor: 'background.default',
                  },
                }}
              >
                <Typography variant="h6" component="div" fontWeight={600} fontSize={20}>
                  EAMS@DEV
                </Typography>
              </Button>
            </Box>

            <Box gap={'20px'} sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  disableRipple
                  onClick={() => (location.href = item.link)}
                  sx={{
                    fontSize: '20px',
                    fontWeight: '400 !important',
                    color: 'text.primary',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: 'background.default',
                    },
                  }}
                  key={item.label}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
          <Divider
            sx={{
              width: { xs: '200% !important', sm: '100% !important' },
              marginLeft: { xs: '-20px', sm: '0px' },
            }}
          />
        </Container>
      </AppBar>
      <Toolbar sx={toolbarStyles} />
    </Box>
  );
}
