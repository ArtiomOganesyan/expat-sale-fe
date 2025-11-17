import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';

import styles from './NewItem.module.css';
import { useTranslation } from 'react-i18next';

function NewItemHeader() {
  const { t } = useTranslation('item');
  const navigate = useNavigate();

  return (
    <div className={styles.header_container}>
      <IconButton onClick={() => navigate('/profile')} className={styles.arrow}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className={styles.title}>{t('header')}</div>
    </div>
  );
}

export default NewItemHeader;
