import Chip from '@mui/material/Chip';

type TagChipProps = {
  tag: string;
  link: string;
};

export default function TagChip({ tag, link }: TagChipProps) {
  return (
    <Chip
      key={tag}
      label={tag}
      clickable
      component="a"
      href={link}
      size="small"
      color="secondary"
      variant="outlined"
      sx={{
        fontSize: '12px',
        height: '18px',
      }}
    />
  );
}
