import { Outlet } from 'react-router';
import { Box, Container } from '@mui/material';

export default function Layout() {
  return (
    <Container sx={{ mt: 1, p: 0, mb: '50px' }}>
      <Box sx={{ px: 1 }}>
        <Outlet />
      </Box>
    </Container>
  );
}
