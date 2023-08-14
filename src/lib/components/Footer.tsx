import { Box, Stack, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      py={'30px'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      alignSelf={'stretch'}
    >
      <Box display={'flex'} alignItems={'flex-start'} gap="14px">
        <Typography>© 2023</Typography>
        <Typography
          component={'a'}
          href="https://www.linkedin.com/in/pete-e-339708117/"
          sx={{ textDecoration: 'none', color: 'text.primary' }}
        >
          LinkedIn
        </Typography>
        <Typography
          component={'a'}
          href="https://github.com/eamsdev"
          sx={{ textDecoration: 'none', color: 'text.primary' }}
        >
          Github
        </Typography>
      </Box>
    </Box>
  );
}
