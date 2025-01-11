import AllBlogPostsSection from '@components/AllBlogPostsSection';
import Banner from '@components/Banner';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { getTotalNumberOfPages } from '@utils/postUtils';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Pete Eamsuwan's Software Development Blog",
  description:
    "Pete Eamsuwan's Software Development Blog. Here I cover software architecture, design, devops as well as some tips and tricks.",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const pageNumber = parseInt(id);
  const totalPages = getTotalNumberOfPages();

  return (
    <main>
      <Banner />
      {pageNumber == 1 && <RecentBlogPostsSection />}
      <AllBlogPostsSection pageNumber={pageNumber} totalPages={totalPages} />
    </main>
  );
}

export async function generateStaticParams() {
  const numberOfPages = getTotalNumberOfPages();

  return Array.from({ length: numberOfPages }, (_, i) => i + 1).map((x) => {
    return { id: x.toString() };
  });
}
