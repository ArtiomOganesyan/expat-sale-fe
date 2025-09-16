import styles from './SettingsPage.module.css';
import Settings from '../../features/settings/Settings';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';
import en from './i18n/en.json';
import ru from './i18n/ru.json';

const SettingsPage = () => {
  const { t } = useCustomTranslation('settings', en, ru);

  return (
    <div className={styles.container}>
      <h2>{t('settings')}</h2>
      <Settings />
    </div>
  );
};

export default SettingsPage;
