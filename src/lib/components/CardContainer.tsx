'use client';

import Card from '@mui/material/Card/Card';

export default function CardContainer({
  children,
  postId,
}: React.PropsWithChildren & { postId: string }) {
  return (
    <Card
      onClick={() => (location.href = `/post/${postId}`)}
      sx={{ borderRadius: 0, boxShadow: 'none', overflow: 'hidden' }}
    >
      {children}
    </Card>
  );
}
