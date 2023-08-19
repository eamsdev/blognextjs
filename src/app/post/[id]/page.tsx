import PostContainer from '../../../lib/components/PostContainer';
import RecentBlogPostsColumn from '@components/RecentBlogPostsColumn';
import Box from '@mui/material/Box/Box';
import { getAllPostIds, getPostData } from '@utils/postUtils';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export default function Page({ params }: Props) {
  const postData = getPostData(params.id);

  return (
    <Box
      component="main"
      display="flex"
      alignItems="flex-start"
      gap="32px"
      alignSelf="stretch"
      marginTop={'32px'}
    >
      <RecentBlogPostsColumn />
      <PostContainer />
    </Box>
  );
}

export const generateStaticParams = (): Params[] => {
  return getAllPostIds();
};
