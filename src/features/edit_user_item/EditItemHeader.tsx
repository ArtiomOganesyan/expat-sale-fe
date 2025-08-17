import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';

import styles from './EditItemForm.module.css';

function EditItemHeader() {
  const navigate = useNavigate();

  return (
    <div className={styles.header_container}>
      <IconButton onClick={() => navigate('/profile/userItemsList')} className={styles.header_icon}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className={styles.header_title}>Return to Item List</div>
    </div>
  );
}

export default EditItemHeader;
