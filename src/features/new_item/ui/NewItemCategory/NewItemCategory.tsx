import { FC, useMemo } from 'react';
import type { ReactNode } from 'react';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { getSelectedOption } from '../../../../utils/getSelectedOption';
import { useAppSelector } from '../../../../hooks/hooks';
import { getCategories } from '../../../../entities/categories/categoriesSlice';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';

interface NewItemCategoryProps {
  className?: string;
  formData: any;
  handleSelectChange: (key: string, value: any) => void;
  error?: boolean;
  helperText?: ReactNode;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const NewItemCategory: FC<NewItemCategoryProps> = ({ className, formData, handleSelectChange, error, helperText, onBlur }) => {
  const categories = useAppSelector(getCategories);
  const subcategories = useMemo(() => {
    const sub_cat: {
      category: string;
      subcategory: string;
      subcategoryId: string;
      groupBy: string;
      label: string;
    }[] = [];

    categories.forEach(category => {
      category?.children?.forEach(child => {
        sub_cat.push({
          category: category.name,
          subcategory: child.name,
          subcategoryId: child.id,
          groupBy: prepareCategoryText(category.name),
          label: prepareCategoryText(child.name),
        });
      });
    });

    return sub_cat;
  }, [categories]);
  return (
    <FormSelect<{
      category: string;
      subcategoryId: string;
    }>
      value={getSelectedOption(subcategories, 'subcategoryId', formData.categoryId)}
      label={'Category'}
      id={'category'}
      onChange={(_, newValue) => {
        handleSelectChange('categoryId', newValue?.subcategoryId ?? formData.categoryId);
      }}
      options={subcategories}
      error={error}
      helperText={helperText}
      onBlur={onBlur}
    />
  );
};
