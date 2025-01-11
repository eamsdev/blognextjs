import BlogPostCard from '@components/BlogPostCard';
import Box from '@mui/material/Box/Box';
import Grid from '@mui/material/Grid/Grid';
import Typography from '@mui/material/Typography/Typography';
import { getAllTags, getCardPropsForTag } from '@utils/postUtils';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  var cardProps = getCardPropsForTag(id);
  return (
    <Box component="main">
      <Box paddingTop={'20px'}>
        <div id="all">
          <Typography fontSize={'24px'} fontWeight={'600'}>
            Tagged with: {id}
          </Typography>
        </div>
        <Grid container spacing={2} marginTop={'10px'}>
          {cardProps.map((x) => (
            <Grid key={x.title} item xs={12} sm={6} md={4}>
              <BlogPostCard {...x} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export async function generateStaticParams() {
  return getAllTags();
}
