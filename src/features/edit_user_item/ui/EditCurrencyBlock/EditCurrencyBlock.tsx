import { FC } from 'react';
import styles from './EditCurrencyBlock.module.css';
import clsx from 'clsx';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { useAppSelector } from '../../../../hooks/hooks';
import { getRates } from '../../../../entities/currency/currencySlice';
import { EditItem } from '../../../../entities/items/items.type';

interface EditCurrencyBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleSelectChange: (key: string, value: any) => void;
  edit: boolean;
}

export const EditCurrencyBlock: FC<EditCurrencyBlockProps> = ({ className, updatedItem, handleSelectChange, edit }) => {
  const currencyRates = useAppSelector(getRates);
  return (
      <FormSelect
        sx={clsx(styles.block, className)}
        value={getSelectedOption(
          currencyRates.map(r => ({
            value: r.iso,
            label: r.symbol,
          })),
          'value',
          updatedItem?.currency
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
        disabled={!edit}
      />
  );
};
