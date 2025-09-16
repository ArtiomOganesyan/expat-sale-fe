import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { LOCAL_STORAGE_KEY_LANGUAGE } from '../../../utils/constants/Item';
import i18n from 'i18next';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import en from '../i18n/en.json';
import ru from '../i18n/ru.json';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  // { code: "de", label: "Deutsch", flag: "🇩🇪" },
  // { code: "fr", label: "Français", flag: "🇫🇷" },
  // { code: "zh", label: "中文", flag: "🇨🇳" },
];

const LocalizationSettings = () => {
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  console.log(currentLanguage);
  const { t } = useCustomTranslation('language', en, ru);

  const handleChange = async (event: SelectChangeEvent) => {
    const newLanguage = event.target.value as string;
    await i18n.changeLanguage(newLanguage);
    localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, newLanguage);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='language-select-label'>{t('language')}</InputLabel>
      <Select
        labelId='currency-select-label'
        value={currentLanguage.code}
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
