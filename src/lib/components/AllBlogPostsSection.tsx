import BlogPostCard from '@components/BlogPostCard';
import BottomPagination from '@components/BottomPagination';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { getCardPropsForPage } from '@utils/postUtils';

type AllBlogPostsSection = {
  pageNumber: number;
  totalPages: number;
};

export default function AllBlogPostsSection({ pageNumber, totalPages }: AllBlogPostsSection) {
  const cardProps = getCardPropsForPage(pageNumber);
  return (
    <Box paddingY={'20px'}>
      <div id="all">
        <Typography fontSize={'24px'} fontWeight={'600'}>
          All blog posts
        </Typography>
      </div>
      <Grid container spacing={2} marginTop={'10px'}>
        {cardProps.map((x) => (
          <Grid key={x.title} item xs={12} sm={6} md={4}>
            <BlogPostCard {...x} />
          </Grid>
        ))}
      </Grid>
      <BottomPagination pageNumber={pageNumber} totalPages={totalPages} />
    </Box>
  );
}
