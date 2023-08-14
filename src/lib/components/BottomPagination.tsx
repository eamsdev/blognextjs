'use client';

import { Box, Pagination } from '@mui/material';
import React from 'react';

type BottomPaginationProps = {
  pageNumber: number;
  totalPages: number;
};

export default function BottomPagination({ pageNumber, totalPages }: BottomPaginationProps) {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      paddingTop={'20px'}
      marginTop={'20px'}
      alignItems={'center'}
      sx={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'text.disabled',
      }}
    >
      <Pagination
        count={2}
        shape="rounded"
        page={pageNumber}
        siblingCount={0}
        boundaryCount={1}
        onChange={onPageChange}
      />
    </Box>
  );
}

const onPageChange = (_: React.ChangeEvent<unknown>, value: number) => {
  location.href = `/page/${value}#all`;
};
