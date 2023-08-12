import NavBar from '@components/NavBar';
import { Divider } from '@mui/material';

export default function Header() {
  return (
    <>
      <NavBar />
      <Divider sx={{ marginBottom: '20px' }} />
    </>
  );
}
