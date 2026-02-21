import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { LOCAL_STORAGE_KEY_LANGUAGE } from '../../../utils/constants/Item';
import i18n from '../../../i18n';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  // { code: "de", label: "Deutsch", flag: "🇩🇪" },
  // { code: "fr", label: "Français", flag: "🇫🇷" },
  // { code: "zh", label: "中文", flag: "🇨🇳" },
];

const LocalizationSettings = () => {
  const { t } = useTranslation('settings');

  const normalize = (lng?: string) => {
    if (!lng) return languages[0].code;
    return lng.split('-')[0];
  };

  const initial = (localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE) as string) || normalize(i18n.language);
  const [selectedLang, setSelectedLang] = useState<string>(normalize(initial));

  // keep local state in sync when i18n changes elsewhere
  useEffect(() => {
    const handler = (lng: string) => setSelectedLang(normalize(lng));
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  const handleChange = async (event: SelectChangeEvent) => {
    const newLanguage = event.target.value as string;
    setSelectedLang(newLanguage);
    await i18n.changeLanguage(newLanguage);
    localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, newLanguage);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='language-select-label'>{t('settings.language')}</InputLabel>
      <Select
        labelId='language-select-label'
        value={selectedLang}
        onChange={handleChange}
      >
        {languages.map((lang: (typeof languages)[0]) => (
          <MenuItem
            key={lang.code}
            value={lang.code}
          >
            {lang.label} {lang.flag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocalizationSettings;
