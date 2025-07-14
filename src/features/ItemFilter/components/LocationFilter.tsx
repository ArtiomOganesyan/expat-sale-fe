import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function LocationFilter() {
  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1 }}>
      <TextField
        id='location'
        name='location'
        label='Location'
        placeholder='Enter city or area'
        fullWidth
        variant='outlined'
        size='small'
      />
    </Box>
  );
}

export default LocationFilter;
