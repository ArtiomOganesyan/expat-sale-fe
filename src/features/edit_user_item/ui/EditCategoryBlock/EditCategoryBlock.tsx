import { FC, useMemo } from 'react';
import styles from './EditCategoryBlock.module.css';
import clsx from 'clsx';
import FormSelect from '../../../../shared/components/FormSelect/FormSelect';
import { EditItem } from '../../../../entities/items/items.type';
import { useAppSelector } from '../../../../hooks/hooks';
import { getCategories } from '../../../../entities/categories/categoriesSlice';
import { prepareCategoryText } from '../../../../utils/prepareCategoryText';

interface EditCategoryBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleSelectChange: (key: string, value: any) => void;
  edit: boolean;
}

export const EditCategoryBlock: FC<EditCategoryBlockProps> = ({ className, updatedItem, handleSelectChange, edit }) => {
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

    
  const selectedCategory = useMemo(() => {
    if (!updatedItem?.categoryId) return null;
    return subcategories.find(cat => cat.subcategoryId === updatedItem.categoryId) || null;
  }, [subcategories, updatedItem?.categoryId]);
  return (
    <FormSelect
      sx={clsx(styles.block, className)}
      value={selectedCategory}
      label='Category'
      id='category'
      onChange={(_, newValue) => {
        handleSelectChange('categoryId', newValue?.subcategoryId || 'Other');
      }}
      options={subcategories}
      disabled={!edit}
    />
  );
};
