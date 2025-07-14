import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

function ConditionFilter({
  filters,
  handleChange,
}: {
  filters: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl
        fullWidth
        size='small'
      >
        <InputLabel htmlFor='condition-select'>Condition</InputLabel>
        <Select
          id='condition-select'
          name='isNew'
          value={filters.isNew || ''}
          label='Condition'
          onChange={e => handleChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)}
        >
          <MenuItem value=''>
            <em>All conditions</em>
          </MenuItem>
          <MenuItem value='true'>New</MenuItem>
          <MenuItem value='false'>Used</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        fullWidth
        size='small'
      >
        <InputLabel htmlFor='isFree'>Is Free</InputLabel>
        <Select
          id='isFree'
          name='isFree'
          value={filters.isFree || ''}
          label='Is Free'
          onChange={e => handleChange(e as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)}
        >
          <MenuItem value=''>
            <em>All conditions</em>
          </MenuItem>
          <MenuItem value='true'>Free</MenuItem>
          <MenuItem value='false'>Not Free</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default ConditionFilter;
