import AllBlogPostsSection from '@components/AllBlogPostsSection';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { getTotalNumberOfPages } from '@utils/postUtils';
import type { Metadata } from 'next';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export const metadata: Metadata = {
  title: "Pete Eamsuwan's Software Development Blog",
  description:
    "Pete Eamsuwan's Software Development Blog. Here I cover software architecture, design, devops as well as some tips and tricks.",
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
