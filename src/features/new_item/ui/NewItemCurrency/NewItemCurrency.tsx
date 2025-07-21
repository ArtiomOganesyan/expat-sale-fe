import type { FC } from 'react';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { useAppSelector } from '../../../../hooks/hooks';
import { getRates } from '../../../../entities/currency/currencySlice';

interface NewItemCurrencyProps {
  className?: string;
  formData: any;
  handleSelectChange: (key: string, value: any) => void;
}

const LOCAL_STORAGE_KEY = 'userCurrency';
const DEFAULT_CURRENCY = 'usd';

export const NewItemCurrency: FC<NewItemCurrencyProps> = ({ className, formData, handleSelectChange }) => {
  const currencyRates = useAppSelector(getRates);

  const savedCurrency = localStorage.getItem(LOCAL_STORAGE_KEY);
  const currentCurrency =
    formData.currency || savedCurrency || DEFAULT_CURRENCY;

  const currentRate = currencyRates.find(rate => rate.iso === currentCurrency);

  const allOptions = currencyRates.map(rate => ({
    value: rate.iso,
    label: `${rate.symbol}`,
  }));

  const fallbackSymbol =
    currencyRates.find(rate => rate.iso === savedCurrency)?.symbol ||
    currencyRates.find(rate => rate.iso === DEFAULT_CURRENCY)?.symbol ||
    '$';

  const selectedOption = currentRate
    ? getSelectedOption(allOptions, 'value', currentCurrency)
    : { value: currentCurrency, label: fallbackSymbol };

  return (
    <FormSelect
      value={selectedOption}
      id={'currency'}
      onChange={(_, newValue) => {
        const selectedCurrency = newValue?.value || DEFAULT_CURRENCY;
        handleSelectChange('currency', selectedCurrency);
      }}
      options={allOptions}
    />
  );
};