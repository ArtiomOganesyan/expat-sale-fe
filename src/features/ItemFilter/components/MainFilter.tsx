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
  console.log(categories);

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
          label='Grouping'
          value={filters.categoryId}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {categories?.map(category => {
            return (
              <>
                <ListSubheader>{category.name}</ListSubheader>;
                {category.children?.map(child => (
                  <MenuItem
                    key={child.id}
                    value={child.id}
                    onClick={() => {}}
                  >
                    {child.name}
                  </MenuItem>
                ))}
              </>
            );
            // (
            //   <option
            //     key={category.id}
            //     value={category.id}
            //   >
            //     {category.name}
            //   </option>
            // );
          })}
          {/* <ListSubheader>Category 1</ListSubheader>
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <ListSubheader>Category 2</ListSubheader>
          <MenuItem value={3}>Option 3</MenuItem>
          <MenuItem value={4}>Option 4</MenuItem> */}
        </Select>
      </FormControl>

      <select
        id='categoryId'
        name='categoryId'
        onChange={e => handleChange(e)}
        value={filters.categoryId}
        defaultValue={''}
      >
        <option
          value=''
          disabled
        >
          Category filter
        </option>
      </select>
    </div>
  );
}

export default MainFilter;

// function GroupedSelect() {
//   return (
//     <div>
//       <FormControl sx={{ m: 1, minWidth: 120 }}>
//         <InputLabel htmlFor='grouped-native-select'>Grouping</InputLabel>
//         <Select
//           native
//           defaultValue=''
//           id='grouped-native-select'
//           label='Grouping'
//         >
//           <option
//             aria-label='None'
//             value=''
//           />
//           <optgroup label='Category 1'>
//             <option value={1}>Option 1</option>
//             <option value={2}>Option 2</option>
//           </optgroup>
//           <optgroup label='Category 2'>
//             <option value={3}>Option 3</option>
//             <option value={4}>Option 4</option>
//           </optgroup>
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
