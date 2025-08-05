import { Outlet } from 'react-router';
import ItemFilter from '../../features/ItemFilter/ItemFilter';
import { Box } from '@mui/material';

function Listing() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0rem',
        paddingTop: '4rem',
        marginBottom: '5rem',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <ItemFilter />
      </Box>
      <Outlet />
    </div>
  );
}

export default Listing;
