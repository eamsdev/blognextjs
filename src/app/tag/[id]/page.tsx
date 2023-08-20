import BlogPostCard from '@components/BlogPostCard';
import Box from '@mui/material/Box/Box';
import Grid from '@mui/material/Grid/Grid';
import Typography from '@mui/material/Typography/Typography';
import { getAllTags, getCardPropsForTag } from '@utils/postUtils';

type Params = {
  id: string;
};

type Props = {
  params: Params;
};

export default function Page({ params }: Props) {
  var cardProps = getCardPropsForTag(params.id);
  return (
    <Box component="main">
      <Box paddingTop={'20px'}>
        <div id="all">
          <Typography fontSize={'24px'} fontWeight={'600'}>
            All blog posts
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

export const generateStaticParams = (): Params[] => {
  return getAllTags();
};
