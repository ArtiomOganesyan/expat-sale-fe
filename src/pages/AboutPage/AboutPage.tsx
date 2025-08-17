import { Button } from '@mui/material';
import styles from './AboutPage.module.css';

import BoostyLogo from '../../assets/svg/boosty.svg';
import PatreonLogo from '../../assets/svg/patreon.svg';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>About</div>
      <div className={styles.description}>
        <span>ExpatSale</span> is a space for expats. <br />
        <br />
        Here, you can quickly sell or exchange things you no longer need and find what will make your new life easier. <br />
        <br />
        If you’d like to thank our team for the work we do, you can leave a donation on one of the following platforms:
      </div>
      <div className={styles.buttons}>
        <Button
          target='_blank'
          rel='noopener noreferrer'
          startIcon={<BoostyLogo />}
          style={{ display: 'flex', flexDirection: 'row' }}
          href='https://boosty.to'
        >
          boosty
        </Button>
        <Button
          target='_blank'
          rel='noopener noreferrer'
          startIcon={<PatreonLogo />}
          variant='outlined'
          href='https://www.patreon.com'
        >
          patreon
        </Button>
      </div>

      <div className={styles.copyright}>©2025 ExpatSale</div>
    </div>
  );
};

export default AboutPage;
