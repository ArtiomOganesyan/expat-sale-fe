import { FC } from 'react';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { CONDITION } from '../../../../utils/constants/Item';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';
import { useTranslation } from 'react-i18next';

interface NewItemConditionProps {
  className?: string;
  formData: any;
  handleSelectChange: (key: string, value: any) => void;
}

export const NewItemCondition: FC<NewItemConditionProps> = ({ className, formData, handleSelectChange }) => {
  const { t } = useTranslation('item');
  return (
    <FormSelect
      value={getSelectedOption(
        Object.values(CONDITION).map(c => ({
          value: c,
          label: prepareCategoryText(t(`form.condition.${c}`)),
        })),
        'value',
        formData.is_new ? 'new' : 'used'
      )}
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
    />
  );
};
