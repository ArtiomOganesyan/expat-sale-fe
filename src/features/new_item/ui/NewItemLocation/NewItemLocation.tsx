import React, { FC, useEffect, useMemo, useState } from 'react';
import FromSelectSearch from '../../../../shared/components/FormSelectSearch/FromSelectSearch';
import { useGetCountriesQuery, useGetRegionsQuery } from '../../../../entities/places/placesAPI';
import type { Country } from '../../../../entities/places/places.type';
import { useTranslation } from 'react-i18next';

interface NewItemLocationProps {
  className?: string;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const NewItemLocation: FC<NewItemLocationProps> = ({ className, handleLocationChange, setFormData }) => {
  const { t } = useTranslation('item');
  // Internal selection state similar to LocationFilter
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Input text values for searching
  const [countryInputValue, setCountryInputValue] = useState('');
  const [regionInputValue, setRegionInputValue] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');

  // Countries: fetch when typing >= 3 chars
  const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery(
    { query: countryInputValue },
    { skip: countryInputValue.length < 3 }
  );

  // Regions: taken from selected country object
  const availableRegions = selectedCountry?.regions || [];
  const filteredRegions = useMemo(
    () => availableRegions.filter(r => r.toLowerCase().includes(regionInputValue.toLowerCase())),
    [availableRegions, regionInputValue]
  );

  // Cities: fetch region object only when a region is selected
  const { data: regions = [], isLoading: isLoadingRegions } = useGetRegionsQuery(
    { query: selectedRegion || '' },
    { skip: !selectedRegion }
  );
  const selectedRegionObj = useMemo(() => regions.find(r => r.region === selectedRegion), [regions, selectedRegion]);
  const availableCities = selectedRegionObj?.cities || [];
  const filteredCities = useMemo(
    () => availableCities.filter(c => c.toLowerCase().includes(cityInputValue.toLowerCase())),
    [availableCities, cityInputValue]
  );

  // Handlers to update both local selection and outer form state
  const onCountrySelect = (value: Country | null) => {
    setSelectedCountry(value);
    setSelectedRegion(null);
    setSelectedCity(null);
    // Update form state
    handleLocationChange('location', 'country', value?.country || '');
    handleLocationChange('location', 'region', '');
    handleLocationChange('location', 'city', '');
    // Clear dependent inputs
    setRegionInputValue('');
    setCityInputValue('');
  };

  const onRegionSelect = (value: string | null) => {
    setSelectedRegion(value);
    setSelectedCity(null);
    handleLocationChange('location', 'region', value || '');
    handleLocationChange('location', 'city', '');
    setCityInputValue('');
  };

  const onCitySelect = (value: string | null) => {
    setSelectedCity(value);
    handleLocationChange('location', 'city', value || '');
  };

  return (
    <React.Fragment>
      {/* Country */}
      <FromSelectSearch<{ country: string }>
        label={t('form.country')}
        id={'country'}
        onChange={(_, newValue) => {
          if (!newValue) return onCountrySelect(null);
          const match = countries.find((c: Country) => c.country === newValue.country);
          onCountrySelect(match || null);
        }}
        inputValue={countryInputValue}
        onInputChange={(_, newInputValue) => setCountryInputValue(newInputValue)}
        options={countries.map((c: Country) => ({ id: c.country, country: c.country, label: c.country }))}
        isLoading={isLoadingCountries}
        error={countryInputValue.length > 0 && countryInputValue.length < 3 ? 'Type at least 3 characters' : ''}
      />

      {/* Region */}
      {selectedCountry && (
        <FromSelectSearch<{ region: string }>
          label={t('form.region')}
          id={'region'}
          onChange={(_, newValue) => onRegionSelect(newValue?.region || null)}
          inputValue={regionInputValue}
          onInputChange={(_, newInputValue) => setRegionInputValue(newInputValue)}
          options={filteredRegions.map(r => ({ id: r, region: r, label: r }))}
          disabled={!selectedCountry}
          isLoading={false}
          error={regionInputValue && filteredRegions.length === 0 ? 'No regions' : ''}
        />
      )}

      {/* City */}
      {selectedCountry && selectedRegion && (
        <FromSelectSearch<{ city: string }>
          label={t('form.city')}
          id={'city'}
          onChange={(_, newValue) => onCitySelect(newValue?.city || null)}
          inputValue={cityInputValue}
          onInputChange={(_, newInputValue) => setCityInputValue(newInputValue)}
          options={filteredCities.map(c => ({ id: c, city: c, label: c }))}
          disabled={!selectedRegion}
          isLoading={isLoadingRegions}
          error={cityInputValue && filteredCities.length === 0 ? 'No cities' : ''}
        />
      )}
    </React.Fragment>
  );
};
