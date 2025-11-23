import { type FC, useMemo } from 'react';
import styles from './EditConditionBlock.module.css';
import clsx from 'clsx';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';
import { CONDITION } from '../../../../utils/constants/Item';
import { type EditItem } from '../../../../entities/items/types/items';
import { useTranslation } from 'react-i18next';

interface EditConditionBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleSelectChange: (key: string, value: any) => void;
  edit: boolean;
}

export const EditConditionBlock: FC<EditConditionBlockProps> = ({ className, updatedItem, handleSelectChange, edit }) => {
  const { t } = useTranslation('item');
  const selectedCondition = useMemo(() => {
    if (updatedItem?.is_new === undefined) return null;
    const value = updatedItem.is_new ? CONDITION.NEW : CONDITION.USED;
    return {
      value,
      label: prepareCategoryText(t(`form.condition.${value}`)),
    };
  }, [updatedItem?.is_new]);

  return (
    <FormSelect
      sx={clsx(styles.block, className)}
      value={selectedCondition}
      label={t('form.condition')}
      id={'condition'}
      onChange={(_, newValue) => {
        const isNew = newValue?.value === 'new';
        handleSelectChange('is_new', isNew);
      }}
      options={Object.values(CONDITION).map(c => ({
        value: c,
        label: prepareCategoryText(t(`form.condition.${c}`)),
      }))}
      disabled={!edit}
    />
  );
};
