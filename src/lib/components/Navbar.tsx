'use client';

import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

const navItems = ['Blog', 'About', 'Contact'];

export default function Navbar() {
  const toolbarStyles = { marginY: '10px' };

  return (
    <Box component="header">
      <AppBar component="nav">
        <Container>
          <Toolbar sx={toolbarStyles}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => {}}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              fontWeight={600}
              fontSize={20}
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
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
                    marginLeft: '14px',
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
        </Container>
      </AppBar>
      <Toolbar sx={toolbarStyles} />
    </Box>
  );
}
