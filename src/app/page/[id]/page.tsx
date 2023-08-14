import AllBlogPostsSection from '@components/AllBlogPostsSection';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { getAllPostIds, getTotalNumberOfPages } from '@utils/postUtils';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export default function Page({ params }: Props) {
  const pageNumber = parseInt(params.id);
  const totalPages = getTotalNumberOfPages();

  return (
    <main>
      {pageNumber == 1 && <RecentBlogPostsSection />}
      <AllBlogPostsSection pageNumber={pageNumber} totalPages={totalPages} />
    </main>
  );
}

export const generateStaticParams = (): Params[] => {
  const numberOfPages = getTotalNumberOfPages();

  return Array.from({ length: numberOfPages }, (x, i) => i + 1).map((x) => {
    return { id: x.toString() };
  });
};
