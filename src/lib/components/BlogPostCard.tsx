import TagChip from '@components/TagChip';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Image from 'next/image';

export type BlogPostCardProps = {
  date: Date;
  tags: string[];
  author: string;
  title: string;
  preview: string;
  thumbnailPath: string;
};

export default function BlogPostCard({
  date,
  tags,
  author,
  title,
  preview,
  thumbnailPath,
}: BlogPostCardProps) {
  return (
    <Card>
      <CardMedia>
        <Image unoptimized loading="eager" alt={title} src={thumbnailPath} />
      </CardMedia>
      <CardContent>
        <Typography color={'primary'}>
          {author} • {date.toLocaleDateString()}
        </Typography>
        <Typography>{title}</Typography>
        <Typography>{preview}</Typography>
      </CardContent>
      <CardActions>
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} link={`/tags/${tag}`} />
        ))}
      </CardActions>
    </Card>
  );
}
