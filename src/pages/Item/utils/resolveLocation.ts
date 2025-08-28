import { type Item } from '../../../entities';

export const resolveLocation = (location?: Item['location']): string => {
  const checkLocation = location?.city || location?.country || location?.region;
  if (checkLocation) {
    return location.country + (location.region ? `, ${location.region}` : '') + (location.city ? `, ${location.city}` : '');
  }
  return 'Not specified';
};
