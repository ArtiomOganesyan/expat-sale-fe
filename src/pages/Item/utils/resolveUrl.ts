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
      const telegramUser = contact.startsWith('@') ? contact.slice(1) : contact;
      // check if the telegramUser contains https://t.me/ or http://t.me/
      if (telegramUser.startsWith('https://t.me/') || telegramUser.startsWith('http://t.me/')) {
        window.open(telegramUser, '_blank');
      } else {
        window.open(`https://t.me/${telegramUser}`, '_blank');
      }
      break;
    case 'email':
      window.open(`mailto:${contact}`, '_blank');
      break;
    case 'zalo':
      break;
    case 'website':
      if (contact.startsWith('https://t.me/') || contact.startsWith('http://t.me/')) {
        window.open(contact, '_blank');
      } else {
        window.open(`https://${contact}`, '_blank');
      }
      window.open(`https://${contact}`, '_blank');
      break;
    default:
      break;
  }
};
