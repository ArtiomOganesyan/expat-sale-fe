import { Outlet } from 'react-router';
import ItemFilter from '../../features/ItemFilter/ItemFilter';
import { Box } from '@mui/material';
import styles from './Listing.module.css';

function Listing() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0rem',
        marginBottom: '5rem',
      }}
    >
      <div className={styles.title}>Discover</div>
      <Box
        sx={{
          mt: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          paddingBottom: 1,
        }}
      >
        <ItemFilter />
      </Box>
      <Outlet />
    </div>
  );
}

export default Listing;
