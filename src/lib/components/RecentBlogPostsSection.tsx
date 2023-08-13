import { Box, Grid, Typography } from '@mui/material';

export default function RecentBlogPostsSection() {
  return (
    <Box paddingY={'20px'}>
      <Typography fontSize={'24px'} fontWeight={'600'}>
        Recent blog posts
      </Typography>
      <Grid container spacing={1} marginTop={'10px'}>
        <Grid item container sm={12} md={6}>
          <Grid item xs={12}>
            <Box bgcolor={'black'} width={'100%'} height={'408px'} color={'white'}>
              1
            </Box>
          </Grid>
        </Grid>
        <Grid item container spacing={1} sm={12} md={6}>
          <Grid item xs={12}>
            <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
              2
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box bgcolor={'black'} width={'100%'} height={'200px'} color={'white'}>
              3
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
