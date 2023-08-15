'use client';

import Box from '@mui/material/Box';
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
      justifyContent={'center'}
      paddingTop={'20px'}
      marginTop={'20px'}
      alignItems={'center'}
      sx={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'divider',
      }}
    >
      <Pagination
        count={totalPages}
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

// type NavButtonProps = {
//   direction: 'back' | 'next';
// };

// const NavButton = ({ direction }: NavButtonProps) => {
//   return (
//     <Button
//       {...(direction == 'next'
//         ? { endIcon: <ArrowForwardIcon /> }
//         : { startIcon: <ArrowBackIcon /> })}
//       sx={{
//         fontSize: '14px',
//         color: 'text.secondary',
//         textTransform: 'none',
//         ':hover': {
//           backgroundColor: 'background.default',
//         },
//       }}
//     >
//       {direction == 'next' ? 'Next' : 'Previous'}
//     </Button>
//   );
// };
