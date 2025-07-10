import { FC } from 'react';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { useAppSelector } from '../../../../hooks/hooks';
import { getRates } from '../../../../entities/currency/currencySlice';

interface NewItemCurrencyProps {
  className?: string;
  formData: any;
  handleSelectChange: (key: string, value: any) => void;
}

export const NewItemCurrency: FC<NewItemCurrencyProps> = ({ className, formData, handleSelectChange }) => {
  const currencyRates = useAppSelector(getRates);
  return (
    <FormSelect
      value={getSelectedOption(
        currencyRates.map(r => ({
          value: r.iso,
          label: r.symbol,
        })),
        'value',
        formData.currency
      )}
      label='Currency'
      id={'currency'}
      onChange={(_, newValue) => {
        handleSelectChange('currency', newValue?.value || 'EUR');
      }}
      options={currencyRates.map(r => ({
        value: r.iso,
        label: r.symbol,
      }))}
    />
  );
};
