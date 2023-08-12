import AllBlogPostsSection from '@components/AllBlogPostsSection';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';

export default function Home() {
  return (
    <main>
      <RecentBlogPostsSection />
      <AllBlogPostsSection />
    </main>
  );
}
