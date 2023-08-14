import BlogPostCard from '@components/BlogPostCard';
import BottomPagination from '@components/BottomPagination';
import { Box, Grid, Typography } from '@mui/material';
import { getAllPostsCardProps } from '@utils/postUtils';

type AllBlogPostsSection = {
  pageNumber: number;
  totalPages: number;
};

export default function AllBlogPostsSection({ pageNumber, totalPages }: AllBlogPostsSection) {
  const allPosts = getAllPostsCardProps();
  let cardProps = getAllPostsCardProps()
    .slice(3 + 4 * (pageNumber - 1)) // Take away recent posts + posts in previous pages
    .slice(0, 4); // Get 4 posts

  if (cardProps.length < 4) {
    cardProps = allPosts.slice(-4);
  }
  return (
    <Box paddingY={'20px'}>
      <div id="all">
        <Typography fontSize={'24px'} fontWeight={'600'}>
          All blog posts
        </Typography>
      </div>
      <Grid container spacing={1.5} marginTop={'10px'}>
        {cardProps.map((x) => (
          <Grid key={x.title} item xs={12} sm={6}>
            <BlogPostCard {...x} condensed />
          </Grid>
        ))}
      </Grid>
      <BottomPagination pageNumber={pageNumber} totalPages={totalPages} />
    </Box>
  );
}
