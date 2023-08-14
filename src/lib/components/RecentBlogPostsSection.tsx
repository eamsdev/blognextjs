import BlogPostCard from '@components/BlogPostCard';
import { Box, Grid, Typography } from '@mui/material';
import { getAllPostsCardProps } from '@utils/postUtils';

export default function RecentBlogPostsSection() {
  const cardProps = getAllPostsCardProps();

  return (
    <Box paddingY={'20px'}>
      <Typography fontSize={'24px'} fontWeight={'600'}>
        Recent blog posts
      </Typography>
      <Grid container spacing={1.5} marginTop={'10px'}>
        <Grid item container sm={12} md={6}>
          <Grid item xs={12}>
            <BlogPostCard {...cardProps[0]} />
          </Grid>
        </Grid>
        <Grid item container spacing={1.5} sm={12} md={6}>
          <Grid item xs={12} sm={6} md={12}>
            <BlogPostCard {...cardProps[0]} condensed />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <BlogPostCard {...cardProps[0]} condensed />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
