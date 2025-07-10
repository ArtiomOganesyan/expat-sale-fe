import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useLocation } from 'react-router';
import { useGetMaxPriceQuery } from '../../../entities/items/itemsAPI';

function valuetext(value: number) {
  return `${value}°C`;
}

function PriceFilter() {
  const [value, setValue] = useState<number[]>([0, 0]);
  const { search } = useLocation();
  const categoryId = new URLSearchParams(search).get('categoryId');
  const { data } = useGetMaxPriceQuery(categoryId || '', {
    skip: !categoryId,
  });

  console.log('Max price query result:', data);

  useEffect(() => {
    if (data && data.maxPrice) {
      setValue([0, data.maxPrice]);
    } else {
      setValue([0, 0]); // Default range if no data is available
    }
  }, [data]);

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);

    console.log(`Selected price range: ${newValue[0]} - ${newValue[1]}`);
  };

  if (!categoryId) {
    return null;
  }

  return (
    <Box>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
        min={0}
      />
    </Box>
  );
}

export default PriceFilter;
