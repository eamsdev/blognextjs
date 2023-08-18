import { getAllPostIds, getPostData } from '@utils/postUtils';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export default function Page({ params }: Props) {
  const postData = getPostData(params.id);

  return <main>{postData.frontmatter.id}</main>;
}

export const generateStaticParams = (): Params[] => {
  return getAllPostIds();
};
