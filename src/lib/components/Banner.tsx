import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';

export default function Banner() {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        mt={5}
        mb={2}
        sx={{
          width: { xs: '100%', sm: '80%', md: '60%' },
        }}
      >
        <Typography fontSize={25}>👋 Hello, I'm Pete!</Typography>
        <Typography fontSize={18} textAlign={'center'} mt={3}>
          Welcome to my personal dev blog. This is where I share things that I have learned in my
          software development journey. I hope you will find my posts here informative, please enjoy
          your stay.
        </Typography>
      </Box>
    </Box>
  );
}
