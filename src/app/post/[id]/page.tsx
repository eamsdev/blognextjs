import PostContainer from '../../../lib/components/PostContainer';
import RecentBlogPostsColumn from '@components/RecentBlogPostsColumn';
import Box from '@mui/material/Box/Box';
import { getAllPostIds, getPostData } from '@utils/postUtils';
import type { Metadata } from 'next';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postData = getPostData(params.id);

  return {
    title: postData.frontmatter.title,
    description: postData.frontmatter.description,
  };
}

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
      minWidth={'0px'}
    >
      <RecentBlogPostsColumn />
      <PostContainer {...postData} />
    </Box>
  );
}

export const generateStaticParams = (): Params[] => {
  return getAllPostIds();
};
