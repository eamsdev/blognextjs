import AllBlogPostsSection from '@components/AllBlogPostsSection';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { getTotalNumberOfPages } from '@utils/postUtils';

export default function Home() {
  const totalPages = getTotalNumberOfPages();

  return (
    <main>
      <RecentBlogPostsSection />
      <AllBlogPostsSection pageNumber={1} totalPages={totalPages} />
    </main>
  );
}
