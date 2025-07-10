import { FC } from 'react';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { CONDITION } from '../../../../utils/constants/Item';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';

interface NewItemConditionProps {
  className?: string;
  formData: any;
  handleSelectChange: (key: string, value: any) => void;
}

export const NewItemCondition: FC<NewItemConditionProps> = ({ className, formData, handleSelectChange }) => {
  return (
    <FormSelect
      value={getSelectedOption(
        Object.values(CONDITION).map(c => ({
          value: c,
          label: prepareCategoryText(c),
        })),
        'value',
        formData.is_new ? 'new' : 'used'
      )}
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
    />
  );
};
