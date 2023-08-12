'use client';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

const navItems = ['Blog', 'About', 'Contact'];

export default function NavBar() {
  const toolbarStyles: SxProps<Theme> = {
    marginY: '10px',
    flexDirection: {
      xs: 'row-reverse',
      sm: 'row',
    },
  };

  return (
    <Box component="header" sx={{ userSelect: 'none' }}>
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
            <Typography
              variant="h6"
              component="div"
              fontWeight={600}
              fontSize={20}
              sx={{ flexGrow: 1 }}
            >
              EAMS@DEV
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button
                  sx={{
                    fontSize: '20px',
                    fontWeight: '400 !important',
                    color: 'text.primary',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: 'background.default',
                    },
                  }}
                  key={item}
                >
                  {item}
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
