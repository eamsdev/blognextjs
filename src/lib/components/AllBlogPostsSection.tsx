import { Box, Grid, Typography } from '@mui/material';

export default function AllBlogPostsSection() {
  return (
    <Box paddingY={'20px'}>
      <Typography fontSize={'24px'} fontWeight={'600'}>
        All blog posts
      </Typography>
      <Grid container spacing={1} marginTop={'10px'}>
        <Grid item xs={12} sm={6}>
          <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
            1
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
            2
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
            3
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
            4
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
