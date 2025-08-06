import { Box, Slider, Typography } from '@mui/material';
import { type FC, useState } from 'react';
import { type EditItem } from '../../../../entities/items/types/items';

interface EditDistanceBlockProps {
  className?: string;
  updatedItem: EditItem;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
  edit: boolean;
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

export const EditDistanceBlock: FC<EditDistanceBlockProps> = ({ className, updatedItem, handleLocationChange, edit }) => {
  const [val, setVal] = useState<number | number[] | undefined>(updatedItem.location ? updatedItem.location.radius : MIN);
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue);
  };
  return (
    <Box sx={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>Distance from City: {val} km</div>
      {/* @ts-ignore */}
      <Slider
        marks={marks}
        step={1}
        value={updatedItem.location ? updatedItem.location.radius : val}
        inputValue={val}
        valueLabelDisplay='auto'
        min={MIN}
        max={MAX}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'radius', newValue);
          handleChange(_, newValue);
        }}
        disabled={!edit}
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
