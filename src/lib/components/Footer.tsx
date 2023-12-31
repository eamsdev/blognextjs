import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box
      component="footer"
      paddingY={'30px'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={{ xs: 'center' }}
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
        <Typography
          component={'a'}
          href="mailto: pete@eams.dev"
          sx={{ textDecoration: 'none', color: 'text.primary' }}
        >
          Email
        </Typography>
      </Box>
    </Box>
  );
}
