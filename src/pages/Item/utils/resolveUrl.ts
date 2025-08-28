import type { PlatformType } from '../ResolveIcon';

export const resolveUrl = (platform: PlatformType, contact: string) => {
  switch (platform) {
    case 'facebook':
      window.open(`https://facebook.com/${contact}`, '_blank');
      break;
    case 'phone':
      window.open(`tel:${contact}`, '_blank');
      break;
    case 'telegram':
      window.open(`https://t.me/${contact}`, '_blank');
      break;
    case 'email':
      window.open(`mailto:${contact}`, '_blank');
      break;
    case 'zalo':
      break;
    default:
      break;
  }
};
