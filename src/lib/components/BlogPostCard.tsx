/* eslint-disable @next/next/no-img-element */
import TagChip from '@components/TagChip';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

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
          height: 'auto',
          display: { sm: 'block', md: `${props.condensed ? 'flex' : 'block'}` },
          alignItems: 'flex-start',
        }}
      >
        <CardMedia
          image={props.thumbnailPath}
          title={props.title}
          sx={{
            minHeight: '200px',
            width: { sm: 'auto', md: `${props.condensed ? '40%' : '100%'}` },
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
  condensed: horizontal,
}: BlogPostCardProps & CardProps) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      sx={{
        width: { sm: 'auto', md: `${horizontal ? '60%' : '100%'}` },
      }}
    >
      <Box>
        <CardContent sx={{ padding: 0 }}>
          <Typography color={'secondary'} fontSize={14} fontWeight={600} marginBottom={1}>
            {author} • {date.toLocaleDateString()}
          </Typography>
          <Typography fontSize={'20px'} fontWeight={'600'} lineHeight={1.3} marginBottom={1}>
            {title}
          </Typography>
          <Typography fontWeight={400} fontSize={'14px'} color={'text.secondary'}>
            {description}
          </Typography>
        </CardContent>
      </Box>
      <CardActions sx={{ padding: 0, marginTop: '10px' }}>
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} link={`/tag/${tag}`} />
        ))}
      </CardActions>
    </Box>
  );
};
