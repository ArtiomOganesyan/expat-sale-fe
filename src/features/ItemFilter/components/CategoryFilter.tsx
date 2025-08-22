import { type Category } from '../../../entities/categories/categories.type';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

function CategoryFilter({
  filters,
  categories,
  handleChange,
}: {
  filters: Record<string, any>;
  categories: Category[] | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  const renderOptions = () => {
    const children = [
      <MenuItem
        value=''
        key=''
      >
        <em>All Categories</em>
      </MenuItem>,
    ];

    categories?.forEach(category => {
      children.push(
        <MenuItem
          key={category.id}
          value={category.id}
          sx={{ borderBottom: '1px solid grey', borderTop: '4px solid grey' }}
        >
          {category.name}
        </MenuItem>
      );
      category.children?.map(child =>
        children.push(
          <MenuItem
            key={child.id}
            value={child.id}
          >
            {child.name}
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
        <InputLabel htmlFor='category-select'>Category</InputLabel>
        <Select
          id='category-select'
          name='categoryId'
          label='Category'
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
