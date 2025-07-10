import { type Category } from '../../../entities/categories/categories.type';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function MainFilter({
  inputValue,
  filters,
  categories,
  handleChange,
}: {
  inputValue: string;
  filters: Record<string, any>;
  categories: Category[] | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const renderOptions = () => {
    const children = [
      <MenuItem value=''>
        <em>None</em>
      </MenuItem>,
    ];

    categories?.forEach(category => {
      children.push(<ListSubheader>{category.name}</ListSubheader>);
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
    <div
      onClick={e => e.stopPropagation()}
      style={{ width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      <input
        id='title'
        type='text'
        placeholder='What are you looking for?'
        name='title'
        value={inputValue}
        onChange={handleChange}
      />

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor='grouped-select'>Category</InputLabel>
        <Select
          defaultValue=''
          id='grouped-select'
          name='categoryId'
          label='Grouping'
          value={filters.categoryId || ''}
          onChange={e => {
            handleChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
          }}
        >
          {renderOptions()}
        </Select>
      </FormControl>
    </div>
  );
}

export default MainFilter;
