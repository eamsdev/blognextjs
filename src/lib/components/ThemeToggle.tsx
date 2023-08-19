'use client';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Box from '@mui/material/Box/Box';
import { ColorModeContext } from '@themes/ThemeWrapper';
import { useContext } from 'react';

export default function ThemeToggle() {
  const { toggleColorMode, currentColorMode } = useContext(ColorModeContext);

  return (
    <Box
      display={'flex'}
      alignItems={'flex-start'}
      gap={'4px'}
      borderRadius={'29px'}
      bgcolor={'text.primary'}
      color={'background.default'}
      width={'50px'}
      height={'26px'}
      position={'relative'}
      onClick={toggleColorMode}
      sx={{
        padding: '3px 3px',
      }}
    >
      <Box
        position={'absolute'}
        left={'4px'}
        width={'20px'}
        height={'20px'}
        bgcolor={'background.default'}
        borderRadius={'50%'}
        sx={{
          transform: `${currentColorMode === 'light' ? '' : 'translateX(23px)'}`,
          transition: 'transform ease 0.05s',
        }}
      />
      <DarkModeOutlinedIcon fontSize="small" />
      <LightModeOutlinedIcon fontSize="small" />
    </Box>
  );
}

function Blocker() {
  // return Box
}
