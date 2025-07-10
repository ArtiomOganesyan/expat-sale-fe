import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

interface NewItemDistanceProps {
  className?: string;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
}

const MAX = 35;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

export const NewItemDistance: React.FC<NewItemDistanceProps> = ({ className, handleLocationChange }) => {
  const [val, setVal] = React.useState<number | number[]>(MIN);
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>Distance from City: {val} km</div>
      <Slider
        marks={marks}
        step={1}
        value={val}
        valueLabelDisplay='auto'
        min={MIN}
        max={MAX}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'radius', newValue);
          handleChange(_, newValue)
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant='body2'
          onClick={() => setVal(MIN)}
          sx={{ cursor: 'pointer' }}
        >
          {MIN} km
        </Typography>
        <Typography
          variant='body2'
          onClick={() => setVal(MAX)}
          sx={{ cursor: 'pointer' }}
        >
          {MAX} km
        </Typography>
      </Box>
    </Box>
  );
};
