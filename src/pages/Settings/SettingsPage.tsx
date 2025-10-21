import styles from './SettingsPage.module.css';
import Settings from '../../features/settings/Settings';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation('settings');

  return (
    <div className={styles.container}>
      <h2>{t('settings')}</h2>
      <Settings />
    </div>
  );
};

export default SettingsPage;
