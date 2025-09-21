export const safeLang = () => {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = window.localStorage.getItem('i18nextLng') ?? '';
      const base = raw.split('-')[0]?.toLowerCase?.();
      const map: Record<string, string> = { en: 'en', ru: 'ru' };
      return map[base ?? ''] || 'en';
    }
  } catch {
    console.log('Error with lang');
  }
  return 'en';
};