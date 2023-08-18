/* eslint-disable @next/next/no-img-element */
import TagChip from '@components/TagChip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// import Image from 'next/image';

export type BlogPostCardProps = {
  date: Date;
  tags: string[];
  author: string;
  title: string;
  description: string;
  thumbnailPath: string;
};

type CardProps = {
  condensed?: boolean;
};

export default function BlogPostCard(props: BlogPostCardProps & CardProps) {
  return (
    <Card sx={{ borderRadius: 0, boxShadow: 'none', overflow: 'hidden' }}>
      <CardActionArea
        sx={{
          display: { md: `${props.condensed ? 'flex' : 'block'}` },
          alignItems: 'flex-start',
          '&:hover': {
            '& .cardImage': {
              filter: 'brightness(95%)',
            },
          },
        }}
      >
        <CardMedia
          className="cardImage"
          image={props.thumbnailPath}
          title={props.title}
          sx={{
            transition: '0.3s filter linear',
            filter: 'brightness(80%)',
            backgroundPosition: 'center',
            minHeight: { xs: '200px', md: `${props.condensed ? '200px' : '259px'}` },
            width: { xs: 'auto', md: `${props.condensed ? '40%' : '100%'}` },
            marginBottom: {
              xs: '20px !important',
              md: `${props.condensed ? '0px !important' : '10px'}`,
            },
            marginRight: { md: `${props.condensed ? '10px' : '0'}` },
          }}
        />
        <StyledCardContent {...props} />
      </CardActionArea>
    </Card>
  );
}

const StyledCardContent = ({
  date,
  tags,
  author,
  title,
  description,
  condensed,
}: BlogPostCardProps & CardProps) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      sx={{
        width: { md: `${condensed ? '60%' : '100%'}` },
        minHeight: { md: `${condensed ? '200px' : '160px'}` },
      }}
    >
      <CardContent sx={{ padding: 0 }}>
        <Typography color={'secondary.dark'} fontSize={14} fontWeight={600} marginBottom={1}>
          {author} • {date.toLocaleDateString()}
        </Typography>
        <Typography fontSize={'20px'} fontWeight={'600'} lineHeight={1.3} marginBottom={1}>
          {title}
        </Typography>
        <Typography fontWeight={400} fontSize={'14px'} color={'text.secondary'}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 0, marginTop: '10px', marginBottom: '2px' }}>
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} link={`/tag/${tag}`} />
        ))}
      </CardActions>
    </Box>
  );
};
