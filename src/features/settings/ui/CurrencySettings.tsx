import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useGetCurrencyRateQuery } from '../../../entities/currency/currencyAPI';
import { LOCAL_STORAGE_KEY_CURRENCY } from '../../../utils/constants/Item';
import { useCustomTranslation } from '../../../hooks/useCustomTranslation';
import en from '../i18n/en.json';
import ru from '../i18n/ru.json';

const CurrencySettings = () => {
  const { data: rates = [] } = useGetCurrencyRateQuery(undefined);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => localStorage.getItem(LOCAL_STORAGE_KEY_CURRENCY) ?? '');
  const { t } = useCustomTranslation('currency', en, ru);
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedCurrency(value);
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENCY, value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='currency-select-label'>{t('currency')}</InputLabel>
      <Select
        labelId='currency-select-label'
        value={selectedCurrency}
        onChange={handleChange}
      >
        {rates.map((rate: any) => (
          <MenuItem
            key={rate.id}
            value={rate.iso_4217}
          >
            {rate.symbol} {rate.iso_4217}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CurrencySettings;
