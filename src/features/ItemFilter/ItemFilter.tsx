import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate } from 'react-router';
import MainFilter from './components/MainFilter';
import CategoryFilter from './components/CategoryFilter';
import PriceFilter from './components/PriceFilter';
import ConditionFilter from './components/ConditionFilter';
import LocationFilter from './components/LocationFilter';
import { getCategories } from '../../entities/categories/categoriesSlice';
import { useAppSelector } from '../../hooks/hooks';

function ItemFilter() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useAppSelector(getCategories);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setInputValue(value);
    } else {
      setFilters((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFilters((prev: any) => ({
      ...prev,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    }));
  };

  useEffect(() => {
    if (Object.keys(filters).length) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });

      navigate(`/listing?${params.toString()}`);
    }
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });

    setFilters(obj);
    setInputValue(obj.title || '');
  }, [location.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev: any) => {
        const state = { ...prev };
        if (inputValue) {
          state.title = inputValue;
        }
        return state;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <MainFilter
          inputValue={inputValue}
          handleChange={handleChange}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CategoryFilter
            filters={filters}
            categories={categories}
            handleChange={handleChange}
          />
          <PriceFilter
            filters={filters}
            onPriceChange={handlePriceChange}
          />
          <ConditionFilter
            filters={filters}
            handleChange={handleChange}
          />
          <LocationFilter />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ItemFilter;
