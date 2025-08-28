import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TelegramIcon from '@mui/icons-material/Telegram';
import SendIcon from '@mui/icons-material/Send';

export const Platform = {
  ZALO: 'zalo',
  FACEBOOK: 'facebook',
  EMAIL: 'email',
  PHONE: 'phone',
  TELEGRAM: 'telegram',
};

export type PlatformType = (typeof Platform)[keyof typeof Platform];

type Props = {
  platform: PlatformType;
};

export const ResolveIcon = (prop: Props) => {
  const { platform } = prop;
  switch (platform) {
    case Platform.ZALO: {
      return <SendIcon />;
    }
    case Platform.FACEBOOK: {
      return <FacebookIcon />;
    }
    case Platform.EMAIL: {
      return <AlternateEmailIcon />;
    }
    case Platform.PHONE: {
      return <PhoneIcon />;
    }
    case Platform.TELEGRAM: {
      return <TelegramIcon />;
    }
    default:
      return null;
  }
};
