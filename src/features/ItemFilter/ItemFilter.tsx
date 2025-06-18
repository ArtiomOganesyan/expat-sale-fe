import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';
import { useLocation, useNavigate } from 'react-router';

function ItemFilter() {
  const [filters, setFilters] = useState<any>({});
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { data: categories, isLoading } = useGetParentCategoriesQuery();

  const handleChange = (e: any) => {
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
      setFilters((prev: any) => ({ ...prev, title: inputValue }));
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [inputValue]);

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          <input
            id='title'
            type='text'
            placeholder='What are you looking for?'
            name='title'
            value={inputValue}
            onChange={handleChange}
          />
          <select
            id='categoryId'
            name='categoryId'
            onChange={handleChange}
            value={filters.categoryId}
          >
            <option
              value=''
              selected
              disabled
            >
              Category filter
            </option>
            {categories?.map(category => <option value={category.id}>{category.name}</option>)}
          </select>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Filter contents go here</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default ItemFilter;
