import BlogPostCard from '@components/BlogPostCard';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { getAllPostsCardProps } from '@utils/postUtils';

export default function RecentBlogPostsColumn() {
  const cardProps = getAllPostsCardProps();
  return (
    <>
      <Box
        display="flex"
        width="300px"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        gap="32px"
      >
        <Typography fontSize={'24px'} fontWeight={600}>
          Recent blog posts
        </Typography>
        {cardProps.map((x) => (
          <BlogPostCard key={x.id} {...x} />
        ))}
      </Box>
    </>
  );
}
