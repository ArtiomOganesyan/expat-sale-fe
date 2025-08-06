import Box from '@mui/material/Box/Box';
import { Checkbox, Typography } from '@mui/material';

function FavoriteFilter({
  filters,
  handleChange,
}: {
  filters: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2 }}>
      <Checkbox
        id='favorite'
        name='favorite'
        checked={Boolean(filters.favorite) || false}
        sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
        onChange={e => {
          handleChange(e);
        }}
      />
      Show Favorites
      <Typography
        variant='h5'
        color='textSecondary'
      >
        Show only your favorite items
      </Typography>
    </Box>
  );
}

export default FavoriteFilter;
