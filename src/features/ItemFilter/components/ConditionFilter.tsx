import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel } from '@mui/material';

function ConditionFilter({
  filters,
  handleChange,
}: {
  filters: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            name='isNew'
            checked={Boolean(filters.isNew)}
            onChange={e =>
              handleChange({
                target: { name: 'isNew', value: e.target.checked ? 'true' : '' },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        }
        label='New only'
        sx={{ ml: 0 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            name='isFree'
            checked={Boolean(filters.isFree)}
            onChange={e =>
              handleChange({
                target: { name: 'isFree', value: e.target.checked ? 'true' : '' },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        }
        label='Free only'
        sx={{ ml: 0 }}
      />
    </Box>
  );
}

export default ConditionFilter;
