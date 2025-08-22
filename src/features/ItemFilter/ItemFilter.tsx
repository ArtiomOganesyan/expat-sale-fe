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
import FavoriteFilter from './components/FavoriteFilter';
import { selectUser } from '../../entities/user/userSlice';

function ItemFilter() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const categories = useAppSelector(getCategories);
  const user = useAppSelector(selectUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'title') {
      setInputValue(value);
    } else {
      setFilters((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (name: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFilters((prev: any) => ({
      ...prev,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      // only set params for non-empty values
      if (value !== undefined && value !== null && String(value).length > 0) params.set(key, String(value));
    });

    const qs = params.toString();
    // If there are filters, navigate to /listing with the query string.
    // If there are no filters and we're already on /listing, navigate to /listing
    // (this clears the query string). Do not redirect from `/` to `/listing`.
    if (qs) {
      navigate(`/listing?${qs}`);
    } else if (location.pathname.startsWith('/listing')) {
      navigate('/listing');
    }
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });

    if (Object.keys(filters).length === 0 && inputValue === '') {
      setFilters(obj);
      setInputValue(obj.title || '');
    }
  }, [location.search]);

  useEffect(() => {
    if (location.pathname === '/') {
      setFilters({});
      setInputValue('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev: any) => {
        const state = { ...prev };
        const trimmed = inputValue.trim();
        if (trimmed.length > 0) {
          state.title = trimmed;
        } else {
          // remove title when input cleared
          delete state.title;
        }
        return state;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  return (
    <Accordion sx={{ width: '100%', backdropFilter: 'blur(20px)', backgroundColor: `rgba(255, 255, 255, 0.5)` }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <MainFilter
          inputValue={inputValue}
          handleChange={handleChange}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {user && (
            <FavoriteFilter
              filters={filters}
              handleChange={handleCheckboxChange}
            />
          )}

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
          <LocationFilter
            filters={filters}
            handleLocationChange={handleLocationChange}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default ItemFilter;
