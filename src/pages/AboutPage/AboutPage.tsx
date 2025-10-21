import { Button, Card, CardContent, Typography } from '@mui/material';
import styles from './AboutPage.module.css';

import PublicIcon from '@mui/icons-material/Public';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivismOutlined';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

import { SvgIcon } from '@mui/material';

import FacebookSVG from '../../assets/svg/facebook.svg';
import LinkedInSVG from '../../assets/svg/linkedin.svg';
import TelegramSVG from '../../assets/svg/telegram.svg';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function AboutPage() {
  const location = useLocation();
  const { t } = useTranslation('about');
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      scrollToId(hash.substring(1));
    }
  }, [location]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Typography
          variant='h2'
          sx={{ textAlign: 'end', fontWeight: '400', letterSpacing: '-2px' }}
        >
          {t('brand')}
        </Typography>
        <Typography
          variant='h4'
          sx={{ textAlign: 'end', fontWeight: '400' }}
        >
          {t('slogan')}
        </Typography>
        <Typography className={styles.tagline}>{t('tagline')}</Typography>
      </div>

      <Card className={styles.mission}>
        <CardContent>
          <Typography
            variant='h4'
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PublicIcon sx={{ color: 'var(--color-accent-strong)', fontSize: '32px' }} />
            {t('mission.title')}
          </Typography>
          <p style={{ whiteSpace: 'pre-line' }}>{t('mission.body')}</p>
        </CardContent>
      </Card>

      <div className={styles.sections}>
        <Card>
          <CardContent>
            <Typography
              variant='h4'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <LiveHelpOutlinedIcon /> {t('offer.title')}
            </Typography>
            <br />
            <Typography
              variant='h5'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SupportAgentIcon sx={{ color: 'var(--color-accent-strong)', fontSize: '32px' }} /> 
              {t('services.title')}
            </Typography>
            <p>
           <b>{t('services.p1.bold1')}</b>
              {t('services.p1.mid')}
              <b>{t('services.p1.bold2')}</b>
              {t('services.p1.end')}
            </p>
          </CardContent>

          <CardContent>
            <Typography
              variant='h5'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <StorefrontIcon sx={{ color: 'var(--color-accent-strong)', fontSize: '32px' }} />
              {t('marketplace.title')}
            </Typography>
            <p>
              {t('marketplace.p1.part1')}
              <b>{t('marketplace.p1.bold1')}</b>
              {t('marketplace.p1.part2')}
              <b>{t('marketplace.p1.bold2')}</b>
              {t('marketplace.p1.part3')}
              </p>
          </CardContent>

          <CardContent id='safe-seller'>
            <Typography
              variant='h5'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <HealthAndSafetyIcon sx={{ color: 'var(--color-accent-strong)', fontSize: '32px' }} /> 
              {t('safeSeller.title')}
            </Typography>

            <p>
              {t('safeSeller.p1.part1')}
              <b>{t('safeSeller.p1.bold1')}</b>
              {t('safeSeller.p1.part2')}
              <b>{t('safeSeller.p1.bold2')}</b>
              {t('safeSeller.p1.part3')}
            </p>

          </CardContent>
        </Card>
      </div>

      <div className={styles.support}>
        <Typography
          variant='h4'
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <VolunteerActivismIcon /> {t('support.title')}
        </Typography>
        <p>{t('support.subtitle')}</p>
        <div className={styles.buttons}>
          <Button
            component='a'
            href='https://www.facebook.com/artiom.oganesyan88'
            target='_blank'
            rel='noopener noreferrer'
            variant='outlined'
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%' }}>
              <SvgIcon
                component={FacebookSVG as any}
                inheritViewBox
                sx={{ fontSize: 32 }}
              />
              {t('links.facebook')}
            </div>
          </Button>
          <Button
            component='a'
            href='https://www.linkedin.com/in/artiom-oganesyan/'
            target='_blank'
            rel='noopener noreferrer'
            variant='outlined'
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%' }}>
              <SvgIcon
                component={LinkedInSVG as any}
                inheritViewBox
                sx={{ fontSize: 32 }}
              />
              {t('links.linkedin')}
            </div>
          </Button>
          <Button
            component='a'
            href='https://t.me/Artiom88'
            target='_blank'
            rel='noopener noreferrer'
            variant='outlined'
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%' }}>
              <SvgIcon
                component={TelegramSVG as any}
                inheritViewBox
                sx={{ fontSize: 32 }}
              />
              {t('links.telegram')}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
