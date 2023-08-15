'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button/Button';
import Pagination from '@mui/material/Pagination';
import React from 'react';

type BottomPaginationProps = {
  pageNumber: number;
  totalPages: number;
};

export default function BottomPagination({ pageNumber, totalPages }: BottomPaginationProps) {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      paddingTop={'20px'}
      marginTop={'20px'}
      alignItems={'center'}
      sx={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'divider',
      }}
    >
      <NavButton
        direction={'back'}
        onClick={() => onPageChange(undefined, pageNumber - 1)}
        disabled={pageNumber <= 1}
      />
      <Pagination
        disabled={totalPages == 1}
        count={totalPages}
        shape="rounded"
        page={pageNumber}
        siblingCount={0}
        boundaryCount={1}
        onChange={onPageChange}
        hideNextButton
        hidePrevButton
      />
      <NavButton
        direction={'next'}
        onClick={() => onPageChange(undefined, pageNumber - 1)}
        disabled={pageNumber >= totalPages}
      />
    </Box>
  );
}

const onPageChange = (_: React.ChangeEvent<unknown> | undefined, value: number) => {
  location.href = `/page/${value}#all`;
};

type NavButtonProps = {
  direction: 'back' | 'next';
  onClick: () => void;
  disabled: boolean;
};

const NavButton = ({ direction, onClick, disabled }: NavButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      {...(direction == 'next'
        ? { endIcon: <ArrowForwardIcon /> }
        : { startIcon: <ArrowBackIcon /> })}
      sx={{
        fontSize: '14px',
        color: 'text.secondary',
        textTransform: 'none',
        ':hover': {
          backgroundColor: 'background.default',
        },
      }}
    >
      {direction == 'next' ? 'Next' : 'Previous'}
    </Button>
  );
};
