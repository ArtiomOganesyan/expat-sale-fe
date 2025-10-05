import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Autocomplete, CircularProgress } from '@mui/material';
import { useGetCountriesQuery, useGetRegionsQuery } from '../../../entities/places/placesAPI';
import { useEffect, useState } from 'react';
import type { Country } from '../../../entities/places/places.type';

type LocationState = {
  country: Country | null;
  region: string | null;
  city: string | null;
};

type LocationFilterProps = {
  filters: Record<string, any>;
  handleLocationChange: (name: string, value: string) => void;
};

function LocationFilter({ filters, handleLocationChange }: LocationFilterProps) {
  // Single source of truth for location state
  const [locationState, setLocationState] = useState<LocationState>({
    country: null,
    region: null,
    city: null,
  });

  // Input values for search queries
  const [searchInputs, setSearchInputs] = useState({
    country: '',
    region: '',
    city: '',
  });

  // Sync state with filters prop
  useEffect(() => {
    setLocationState(prev => ({
      country: prev.country, // Keep existing country object if already set
      region: filters.region || null,
      city: filters.city || null,
    }));

    setSearchInputs(prev => ({
      country: filters.country || prev.country,
      region: filters.region || prev.region,
      city: filters.city || prev.city,
    }));
  }, [filters]);

  // Decide whether we should fetch countries: either user typed >=3 chars OR we have a pre-filled filter (page reload case)
  const shouldFetchCountries =
    (searchInputs.country && searchInputs.country.length >= 3) || (filters.country && searchInputs.country === filters.country);

  // Fetch countries when user types (minimum 3 chars) OR when we need to rehydrate pre-selected country from filters on reload
  const { data: countries = [], isFetching: isLoadingCountries } = useGetCountriesQuery(
    { query: searchInputs.country },
    { skip: !shouldFetchCountries }
  );

  // When countries load and we have a country filter but no country object selected yet, set it.
  useEffect(() => {
    if (!locationState.country && filters.country && countries.length) {
      const matched = countries.find(c => c.country === filters.country);
      if (matched) {
        setLocationState(prev => ({ ...prev, country: matched }));
      }
    }
  }, [countries, filters.country, locationState.country]);

  // Get regions from selected country (no API call needed)
  const availableRegions = locationState.country?.regions || [];
  const filteredRegions = availableRegions.filter(region => region.toLowerCase().includes(searchInputs.region.toLowerCase()));

  // Get cities from selected region
  // First, we need to get the region object to access its cities
  const { data: regions = [], isFetching: isLoadingRegions } = useGetRegionsQuery(
    { query: locationState.region || '' },
    { skip: !locationState.region }
  );

  // Get the selected region object to access its cities
  const selectedRegionObject = regions.find(r => r.region === locationState.region);
  const availableCities = selectedRegionObject?.cities || [];

  // Filter cities based on search input
  const filteredCities = availableCities.filter(city => city.toLowerCase().includes(searchInputs.city.toLowerCase()));

  const handleCountryChange = (country: Country | null) => {
    setLocationState(prev => ({
      ...prev,
      country,
      region: null, // Clear dependent selections
      city: null,
    }));
    handleLocationChange('country', country?.country || '');
    handleLocationChange('region', ''); // Clear region filter
    handleLocationChange('city', ''); // Clear city filter
    setSearchInputs(prev => ({ ...prev, region: '', city: '' }));
  };

  const handleRegionChange = (region: string | null) => {
    setLocationState(prev => ({
      ...prev,
      region,
      city: null, // Clear dependent selection
    }));
    handleLocationChange('region', region || '');
    handleLocationChange('city', ''); // Clear city filter
    setSearchInputs(prev => ({ ...prev, city: '' }));
  };

  const handleCityChange = (city: string | null) => {
    setLocationState(prev => ({ ...prev, city }));
    handleLocationChange('city', city || '');
  };

  const renderAutocomplete = (
    label: string,
    options: any[],
    value: any,
    inputValue: string,
    isLoading: boolean,
    disabled: boolean,
    getOptionLabel: (option: any) => string,
    onChange: (value: any) => void,
    onInputChange: (value: string) => void,
    placeholder?: string
  ) => (
    <Autocomplete
      options={options}
      size='small'
      getOptionLabel={getOptionLabel}
      value={value}
      inputValue={inputValue}
      loading={isLoading}
      disabled={disabled}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => onInputChange(newInputValue)}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          title=''
          InputLabelProps={{
            sx: {
              // style the floating label when it acts like a placeholder
              background: 'var(--color-invisible)',
              px: '4px',
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress
                    color='inherit'
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      noOptionsText={inputValue.length < 3 ? `Type at least 3 characters to search ${label.toLowerCase()}...` : 'No options'}
      clearOnBlur={false}
      selectOnFocus
      clearOnEscape
    />
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {renderAutocomplete(
        'Country',
        countries,
        locationState.country,
        searchInputs.country,
        isLoadingCountries,
        false,
        option => option.country,
        handleCountryChange,
        value => setSearchInputs(prev => ({ ...prev, country: value })),
        'Start typing to search countries...'
      )}
      {locationState.country &&
        renderAutocomplete(
          'Region',
          filteredRegions,
          locationState.region,
          searchInputs.region,
          false, // local filter only
          false,
          option => option,
          handleRegionChange,
          value => setSearchInputs(prev => ({ ...prev, region: value })),
          'Start typing to search regions...'
        )}
      {locationState.country &&
        locationState.region &&
        renderAutocomplete(
          'City',
          filteredCities,
          locationState.city,
          searchInputs.city,
          isLoadingRegions,
          false,
          option => option,
          handleCityChange,
          value => setSearchInputs(prev => ({ ...prev, city: value })),
          'Start typing to search cities...'
        )}
    </Box>
  );
}

export default LocationFilter;
