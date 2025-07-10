import { FC, useMemo } from 'react';
import styles from './EditConditionBlock.module.css';
import clsx from 'clsx';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { EditItem } from '../../../../entities/items/items.type';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';
import { CONDITION } from '../../../../utils/constants/Item';

interface EditConditionBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleSelectChange: (key: string, value: any) => void;
  edit: boolean;
}

export const EditConditionBlock: FC<EditConditionBlockProps> = ({ className, updatedItem, handleSelectChange, edit }) => {
  const selectedCondition = useMemo(() => {
    if (updatedItem?.is_new === undefined) return null;
    const value = updatedItem.is_new ? CONDITION.NEW : CONDITION.USED;
    return {
      value,
      label: prepareCategoryText(value),
    };
  }, [updatedItem?.is_new]);

  return (
    <FormSelect
      sx={clsx(styles.block, className)}
      value={selectedCondition}
      label={'Condition'}
      id={'condition'}
      onChange={(_, newValue) => {
        const isNew = newValue?.value === 'new';
        handleSelectChange('is_new', isNew);
      }}
      options={Object.values(CONDITION).map(c => ({
        value: c,
        label: prepareCategoryText(c),
      }))}
      disabled={!edit}
    />
  );
};
