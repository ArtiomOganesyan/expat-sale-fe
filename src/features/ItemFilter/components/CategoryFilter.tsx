import { type Category } from '../../../entities/categories/categories.type';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { toSnakeCase } from '../../../utils/toSnakeCase';

function CategoryFilter({
  filters,
  categories,
  handleChange,
}: {
  filters: Record<string, any>;
  categories: Category[] | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  const { t } = useTranslation('filter');

  const renderOptions = () => {
    const children = [
      <MenuItem
        value=''
        key=''
      >
        <em>{t(`filter.categories.all_categories`)}</em>
      </MenuItem>,
    ];

    categories?.forEach(category => {
      children.push(
        <MenuItem
          key={category.id}
          value={category.id}
          sx={{ borderBottom: '1px solid grey', borderTop: '4px solid grey' }}
        >
          {t(`filter.categories.${toSnakeCase(category.slug)}`)}
        </MenuItem>
      );

      category.children?.map(child =>
        children.push(
          <MenuItem
            key={child.id}
            value={child.id}
          >
            {t(`filter.categories.${toSnakeCase(category.slug)}.${toSnakeCase(child.slug)}`)}
          </MenuItem>
        )
      );
    });

    return children;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1 }}>
      <FormControl
        fullWidth
        size='small'
      >
        <InputLabel
          sx={{ background: 'var(--color-invisible)' }}
          htmlFor='category-select'
        >
          {t('filter.categories')}
        </InputLabel>
        <Select
          id='category-select'
          name='categoryId'
          label={t('filter.categories')}
          value={filters.categoryId || ''}
          onChange={e => {
            handleChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>);
          }}
        >
          {renderOptions()}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CategoryFilter;
