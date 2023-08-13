import BlogPostCard from '@components/BlogPostCard';
import { Box, Grid, Typography } from '@mui/material';
import { getAllPostsCardProps } from '@utils/postUtils';

export default function AllBlogPostsSection() {
  const cardProps = getAllPostsCardProps();
  return (
    <Box paddingY={'20px'}>
      <Typography fontSize={'24px'} fontWeight={'600'}>
        All blog posts
      </Typography>
      <Grid container spacing={2} marginTop={'10px'}>
        <Grid item xs={12} sm={6}>
          <BlogPostCard {...cardProps[0]} condensed />
        </Grid>
        <Grid item xs={12} sm={6}>
          <BlogPostCard {...cardProps[0]} condensed />
        </Grid>
        <Grid item xs={12} sm={6}>
          <BlogPostCard {...cardProps[0]} condensed />
        </Grid>
        <Grid item xs={12} sm={6}>
          <BlogPostCard {...cardProps[0]} condensed />
        </Grid>
      </Grid>
    </Box>
  );
}
