import { Button, Card, CardContent, Typography } from '@mui/material';
import styles from './AboutPage.module.css';

import PublicIcon from '@mui/icons-material/Public';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { SvgIcon } from '@mui/material';

import FacebookSVG from '../../assets/svg/facebook.svg';
import LinkedInSVG from '../../assets/svg/linkedin.svg';
import TelegramSVG from '../../assets/svg/telegram.svg';

function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Typography
          variant='h2'
          sx={{ textAlign: 'end', fontWeight: '400', letterSpacing: '-2px' }}
        >
          About ExpatSale
        </Typography>
        <p className={styles.tagline}>Helping people move, settle, and start fresh — anywhere in the world.</p>
      </div>

      <Card className={styles.mission}>
        <CardContent>
          <Typography
            variant='h4'
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PublicIcon /> Our Mission
          </Typography>
          <p>
            We’re a small team of passionate developers who have lived through the struggles of relocation — selling everything
            before leaving, landing in a new country, and trying to rebuild from scratch. <br />
            <br />
            ExpatSale exists to make that journey smoother. Whether you’re moving across the street or across continents, we want
            you to feel supported, connected, and ready for your new chapter.
          </p>
        </CardContent>
      </Card>

      <div className={styles.sections}>
        <Card>
          <CardContent>
            <Typography
              variant='h4'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <LiveHelpOutlinedIcon /> What we offer
            </Typography>
            <br />
            <Typography
              variant='h5'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SupportAgentIcon /> Services
            </Typography>
            <p>
              <b>Find trusted specialists</b> who understand the expat life —{' '}
              <b>movers, translators, legal help, housing, and more</b>. Everything you need to navigate relocation without the
              stress.
            </p>
          </CardContent>

          <CardContent>
            <Typography
              variant='h5'
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <StorefrontIcon /> Marketplace
            </Typography>
            <p>
              A flea-market style space to <b>sell what you don’t need</b> and
              <b> find what you do</b>. Moving out? List your stuff. Just arrived? Discover affordable items to make your new
              place feel like home.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className={styles.support}>
        <Typography
          variant='h4'
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <VolunteerActivismIcon /> Support Our Work
        </Typography>
        <p>Contact us to learn about current support options:</p>
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
              Facebook
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
              LinkedIn
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
              Telegram
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
