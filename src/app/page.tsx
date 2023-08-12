import AllBlogPostsSection from '@components/AllBlogPostsSection';
import RecentBlogPostsSection from '@components/RecentBlogPostsSection';
import { Divider } from '@mui/material';

export default function Home() {
  return (
    <main>
      <RecentBlogPostsSection />
      <AllBlogPostsSection />
      <Divider />
    </main>
  );
}
