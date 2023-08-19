import RecentBlogPostsColumn from '@components/RecentBlogPostsColumn';
import Box from '@mui/material/Box/Box';
import Divider from '@mui/material/Divider/Divider';
import Typography from '@mui/material/Typography/Typography';
import Image from 'next/image';

export default function Home() {
  return (
    <Box
      component="main"
      display="flex"
      alignItems="flex-start"
      gap="32px"
      alignSelf="stretch"
      marginTop={'32px'}
      minWidth={'0px'}
    >
      <RecentBlogPostsColumn />
      <Box
        flexGrow={1}
        display="flex"
        justifyItems="center"
        alignItems="center"
        flexDirection="column"
        alignSelf="stretch"
        marginTop={'10px'}
        minWidth={'0px'}
        sx={{
          textAlign: { xs: 'unset', sm: 'justify' },
        }}
      >
        <Image
          unoptimized // Optimised images still not support for SSG, Pre-optimized with preload header
          loading="eager"
          width={280}
          height={280}
          alt="Pete Eamsuwan"
          src={'/profilePhoto.webp'}
        />
        <Box marginTop={2}>
          <Typography component="span" fontSize="42px" fontWeight={600} color="secondary.light">
            Hello,
          </Typography>
          <Typography component="span" fontSize="42px" fontWeight={600} color="text.disabled">
            {' '}
            I&apos;m{' '}
          </Typography>
          <Typography fontSize="42px" fontWeight={600} component="span" color="secondary.dark">
            Pete
          </Typography>
        </Box>
        <Box fontSize="36px" fontWeight={600} textAlign="center" lineHeight={0.5}>
          <Typography
            component="span"
            fontSize="inherit"
            fontWeight="inherit"
            color="text.disabled"
            sx={{
              fontSize: { xs: '30px', sm: '36px' },
            }}
          >
            I&apos;m a{' '}
          </Typography>
          <Typography
            fontSize="inherit"
            fontWeight="inherit"
            component="span"
            color="secondary.main"
            sx={{
              fontSize: { xs: '28px', sm: '36px' },
              lineHeight: 0,
            }}
          >
            Software Engineer{' '}
          </Typography>
        </Box>
        {/* <Divider sx={{ width: '100%', marginTop: '10px' }} /> */}
        <Box
          color="secondary.light"
          display="flex"
          flexDirection="column"
          gap="15px"
          marginTop={3}
          fontSize={18}
          sx={{
            paddingX: { xs: '0px', sm: '10px' },
          }}
        >
          <Typography fontSize="inherit" fontWeight="inherit" component="p">
            Welcome to my software development blog! My name is Pete and I am a Software Engineer
            based in Melbourne. I have a strong background in .NET, C#, React, Cloud Services, and
            Relational Databases, and have experience working on a variety of projects ranging from
            web applications to backend systems that power medical devices.
          </Typography>
          <Typography fontSize="inherit" fontWeight="inherit" component="p">
            I am drawn to the field of software development because of its constantly evolving
            nature and the endless opportunities for learning and growth. As a lifelong learner, I
            am always seeking out new challenges and technologies to explore.
          </Typography>
          <Typography fontSize="inherit" fontWeight="inherit" component="p">
            In this blog, I detail the challenges I have faced in my software development journey
            and how I have approached and solved them. While I am not currently looking for new job
            opportunities, I am always open to connecting with others in the industry and sharing my
            experiences and insights. If you have any questions or would like to connect, please
            don&#39;t hesitate to reach out.
          </Typography>
          <Typography fontSize="inherit" fontWeight="inherit" component="p">
            Thanks for visiting my blog, and I hope you find my content helpful and informative.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
