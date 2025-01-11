import PostContainer from '../../../lib/components/PostContainer';
import RecentBlogPostsColumn from '@components/RecentBlogPostsColumn';
import Box from '@mui/material/Box/Box';
import { getAllPostIds, getPostData } from '@utils/postUtils';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const postData = getPostData(id);

  return {
    title: postData.frontmatter.title,
    description: postData.frontmatter.description,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const postData = getPostData(id);

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

export async function generateStaticParams() {
  return getAllPostIds();
}
