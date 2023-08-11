import { Chip } from '@mui/material';

type TagChipProps = {
  tag: string;
  link: string;
};

export default function TagChip({ tag, link }: TagChipProps) {
  return <Chip key={tag} label={tag} clickable component="a" href={link} />;
}
