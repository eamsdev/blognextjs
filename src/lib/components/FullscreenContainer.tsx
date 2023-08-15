import Box from '@mui/material/Box';

type FullscreenContainerProps = {} & React.PropsWithChildren;

const FullscreenContainer = ({ children }: FullscreenContainerProps) => {
  return (
    <Box
      position={'fixed'}
      top={0}
      bottom={0}
      left={0}
      right={0}
      width={'100%'}
      height={'100%'}
      sx={{ overflowY: 'auto' }}
    >
      {children}
    </Box>
  );
};

export default FullscreenContainer;
