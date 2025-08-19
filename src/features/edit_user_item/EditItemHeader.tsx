import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';

import styles from './EditItemForm.module.css';
import { Typography } from '@mui/material';

function EditItemHeader() {
  const navigate = useNavigate();

  return (
    <div className={styles.header_container}>
      <IconButton onClick={() => navigate('/profile/userItemsList')}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography
        variant='h5'
        fontWeight={600}
      >
        Return to Item List
      </Typography>
    </div>
  );
}

export default EditItemHeader;
