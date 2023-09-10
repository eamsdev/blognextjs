import AllBlogPostsSection from '@components/AllBlogPostsSection';
import Banner from '@components/Banner';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { getTotalNumberOfPages } from '@utils/postUtils';

export default function Home() {
  const totalPages = getTotalNumberOfPages();

  return (
    <main>
      <Banner />
      <RecentBlogPostsSection />
      <AllBlogPostsSection pageNumber={1} totalPages={totalPages} />
    </main>
  );
}
