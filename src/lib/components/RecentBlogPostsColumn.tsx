import BlogPostCard from '@components/BlogPostCard';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { getAllPostsCardProps } from '@utils/postUtils';

export default function RecentBlogPostsColumn() {
  const cardProps = getAllPostsCardProps().slice(1).slice(0, 5);
  return (
    <>
      <Box
        display="flex"
        width="300px"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        gap="36px"
        sx={{
          minWidth: { sm: '250px', lg: '250px' },
          width: { sm: '250px', lg: '250px' },
          display: { xs: 'none', md: 'flex' },
        }}
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
