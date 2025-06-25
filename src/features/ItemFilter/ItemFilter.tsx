import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';
import { useLocation, useNavigate } from 'react-router';
import MainFilter from './components/MainFilter';
import PriceFilter from './components/PriceFilter';
import ConditionFilter from './components/ConditionFilter';
import LocationFilter from './components/LocationFilter';

function ItemFilter() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { data: categories, isLoading } = useGetParentCategoriesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setInputValue(value);
    } else {
      setFilters((prev: any) => ({ ...prev, [name]: value }));
    }
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
          filters={filters}
          categories={categories}
          handleChange={handleChange}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PriceFilter />
        <ConditionFilter
          filters={filters}
          handleChange={handleChange}
        />
        <LocationFilter />
      </AccordionDetails>
    </Accordion>
  );
}

export default ItemFilter;
