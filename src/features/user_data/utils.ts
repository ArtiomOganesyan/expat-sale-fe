import { User } from '../../entities/user/user.type';

export const isValidUpdatedUserData = (user: User | null): { isValid: boolean; message: string } => {
  if (!user) return { isValid: false, message: 'User data is missing' };
  if (!user.username) return { isValid: false, message: 'Username is required' };

  // check if the length of contacts is greater than 50 chars
  const contactPlatforms = user.contact_platforms;
  if (contactPlatforms) {
    for (const [key, value] of Object.entries(contactPlatforms)) {
      if (typeof value === 'string' && value.length > 50) {
        return { isValid: false, message: `${key} must be 50 characters or less` };
      }
    }
  }

  return { isValid: true, message: '' };
};
