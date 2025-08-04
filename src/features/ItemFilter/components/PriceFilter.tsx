import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';
import { useGetMaxPriceQuery } from '../../../entities/items/itemsAPI';

function valuetext(value: number) {
  return `$${value}`;
}

type PriceFilterProps = {
  filters: Record<string, any>;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
};

function PriceFilter({ filters, onPriceChange }: PriceFilterProps) {
  const [value, setValue] = useState<[number, number]>([0, 0]);
  const { search } = useLocation();
  const categoryId = new URLSearchParams(search).get('categoryId');
  const { data } = useGetMaxPriceQuery(
    {
      categoryId: categoryId || '',
    },
    {
      skip: !categoryId,
    }
  );

  const debouncedPriceChange = useCallback(
    (() => {
      let timeoutId: number;
      return (minPrice: number, maxPrice: number) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onPriceChange(minPrice, maxPrice);
        }, 500); // 500ms debounce
      };
    })(),
    [onPriceChange]
  );

  useEffect(() => {
    const minPrice = filters.minPrice ? parseInt(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) : data?.maxPrice && data.maxPrice > 0 ? data.maxPrice : 1000;
    setValue([minPrice, maxPrice]);
  }, [filters.minPrice, filters.maxPrice, data?.maxPrice]);

  useEffect(() => {
    if (data && data.maxPrice && data.maxPrice > 0) {
      const currentMax = filters.maxPrice ? parseInt(filters.maxPrice) : data.maxPrice;
      setValue([value[0], Math.min(currentMax, data.maxPrice)]);
    } else {
      setValue([0, 0]);
    }
  }, [data]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const [minPrice, maxPrice] = newValue as [number, number];
      setValue([minPrice, maxPrice]);

      // Only trigger filter update if values are different from current filters
      const currentMin = filters.minPrice ? parseInt(filters.minPrice) : 0;
      const currentMax = filters.maxPrice
        ? parseInt(filters.maxPrice)
        : data?.maxPrice && data.maxPrice > 0
          ? data.maxPrice
          : 1000;

      if (minPrice !== currentMin || maxPrice !== currentMax) {
        debouncedPriceChange(minPrice, maxPrice);
      }
    }
  };

  if (!categoryId) {
    return null;
  }

  const maxPrice = data?.maxPrice && data.maxPrice > 0 ? data.maxPrice : 1000;

  if (filters.isFree) {
    return null;
  }

  if (value[0] === value[1]) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1 }}>
      <Typography
        id='price-range-slider'
        gutterBottom
      >
        Price Range: ${value[0]} - ${value[1]}
      </Typography>
      <Slider
        getAriaLabel={() => 'Price range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
        min={0}
        max={maxPrice}
        step={10}
      />
    </Box>
  );
}

export default PriceFilter;
