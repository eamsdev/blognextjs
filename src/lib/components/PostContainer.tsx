import { StylisedMarkdown } from '@components/StylisedMarkdown';
import TagChip from '@components/TagChip';
import Box from '@mui/material/Box/Box';
import Divider from '@mui/material/Divider/Divider';
import Typography from '@mui/material/Typography/Typography';
import { PostData } from '@utils/postUtils';

export default function PostContainer(props: PostData) {
  const {
    body,
    frontmatter: { title, description, date, author, tags },
  } = props;

  return (
    <Box
      minWidth={'0px'}
      marginTop={'8px'}
      sx={{
        wordBreak: 'break-word',
        '.markdown': {
          a: {
            color: 'primary.dark',
          },
          '& > p': {
            overflow: 'auto',
            '& > img': {
              maxWidth: '600px',
              minWidth: '400px',
            },
          },
          'p > code, li > code': {
            padding: '0.2em 0.4em',
            margin: '0',
            fontSize: '85%',
            whiteSpace: 'break-spaces',
            borderRadius: '6px',
            color: '#fff',
            backgroundColor: '#3a3a3a',
          },
          'pre, img': {
            borderRadius: '0.3em',
          },
          'h1, h2, h3, h4, h5': {
            '& + p': {
              marginTop: '2px',
            },
          },
        },
      }}
    >
      <Typography color={'secondary.dark'} fontSize={14} fontWeight={600} marginBottom={1}>
        {author} • {date.toLocaleDateString()}
      </Typography>
      <Typography component={'h1'} fontSize={42} fontWeight={700} lineHeight={1.2}>
        {title}
      </Typography>
      <Typography
        component={'h2'}
        marginTop={'10px'}
        fontSize={18}
        fontWeight={600}
        lineHeight={1.2}
        color={'text.secondary'}
      >
        {description}
      </Typography>
      <Box display={'flex'} gap={1} marginTop={2}>
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} link={`/tag/${tag}`} />
        ))}
      </Box>
      <Divider sx={{ marginTop: '16px' }} />
      <StylisedMarkdown markdown={body} />
    </Box>
  );
}
