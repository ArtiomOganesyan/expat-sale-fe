import React, { type FC, useEffect, useMemo, useState } from 'react';
import FromSelectSearch from '../../../../shared/components/FormSelectSearch/FromSelectSearch';
import { useGetCountriesQuery, useGetRegionsQuery } from '../../../../entities/places/placesAPI';
import type { Country } from '../../../../entities/places/places.type';
import { type EditItem } from '../../../../entities/items/types/items';
import { useTranslation } from 'react-i18next';

interface EditLocationBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
  edit: boolean;
}

export const EditLocationBlockBlock: FC<EditLocationBlockProps> = ({ updatedItem, handleLocationChange, edit }) => {
    const { t } = useTranslation('item');
  // Mirror LocationFilter/NewItemLocation: selected country object + inputs
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [countryInputValue, setCountryInputValue] = useState<string>(updatedItem?.location?.country || '');
  const [regionInputValue, setRegionInputValue] = useState<string>(updatedItem?.location?.region || '');
  const [cityInputValue, setCityInputValue] = useState<string>(updatedItem?.location?.city || '');

  // Decide whether to fetch countries: typed >=3 or prefilled
  const shouldFetchCountries =
    countryInputValue.length >= 3 || (!!updatedItem?.location?.country && countryInputValue === updatedItem.location.country);

  const { data: Countries = [], isLoading: IsLoadingCountries } = useGetCountriesQuery(
    { query: countryInputValue },
    { skip: !shouldFetchCountries }
  );

  // When countries load, if we have a prefilled country and no selectedCountry, hydrate it
  useEffect(() => {
    const countryName = updatedItem?.location?.country;
    if (!selectedCountry && countryName && Countries.length) {
      const matched = Countries.find(c => c.country === countryName);
      if (matched) setSelectedCountry(matched);
    }
  }, [Countries, selectedCountry, updatedItem?.location?.country]);

  // Regions are derived from selectedCountry
  const availableRegions = selectedCountry?.regions || [];
  const filteredRegions = availableRegions.filter(r => r.toLowerCase().includes(regionInputValue.toLowerCase()));

  // Cities fetched by region via regions API
  const { data: Regions = [], isLoading: IsLoadingRegions } = useGetRegionsQuery(
    { query: selectedRegion || '' },
    { skip: !selectedRegion }
  );
  const selectedRegionObject = Regions.find(r => r.region === selectedRegion);
  const availableCities = selectedRegionObject?.cities || [];
  const filteredCities = availableCities.filter(c => c.toLowerCase().includes(cityInputValue.toLowerCase()));

  useEffect(() => {
    // If updatedItem changes (initial load), ensure local selections reflect it
    if (updatedItem) {
      if (updatedItem.location?.country) setCountryInputValue(updatedItem.location.country);
      if (updatedItem.location?.region) setRegionInputValue(updatedItem.location.region);
      if (updatedItem.location?.city) setCityInputValue(updatedItem.location.city);
      // Prefill selected values so UI shows fields immediately on edit page load
      if (updatedItem.location?.country && !selectedCountry) {
        setSelectedCountry({
          country: updatedItem.location.country,
          regions: updatedItem.location.region ? [updatedItem.location.region] : [],
        });
      }
      if (updatedItem.location?.region && !selectedRegion) {
        setSelectedRegion(updatedItem.location.region);
      }
      if (updatedItem.location?.city && !selectedCity) {
        setSelectedCity(updatedItem.location.city);
      }
    }
  }, [updatedItem]);

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setSelectedCity(null);
    setRegionInputValue('');
    setCityInputValue('');
    handleLocationChange('location', 'country', country?.country || '');
    handleLocationChange('location', 'region', '');
    handleLocationChange('location', 'city', '');
  };

  const handleRegionSelect = (region: string | null) => {
    setSelectedRegion(region);
    setSelectedCity(null);
    setCityInputValue('');
    handleLocationChange('location', 'region', region || '');
    handleLocationChange('location', 'city', '');
  };

  const handleCitySelect = (city: string | null) => {
    setSelectedCity(city);
    handleLocationChange('location', 'city', city || '');
  };
  return (
    <React.Fragment>
      <FromSelectSearch<{ country: string }>
        value={selectedCountry ? { country: selectedCountry.country, label: selectedCountry.country } : null}
        label={t('form.country')}
        id={'country'}
        onChange={(_, newValue) => {
          if (!newValue) return handleCountrySelect(null);
          const match = Countries.find((c: Country) => c.country === newValue.country);
          handleCountrySelect(match || null);
        }}
        inputValue={countryInputValue}
        onInputChange={(_, newInputValue) => setCountryInputValue(newInputValue)}
        options={Countries.map((item: Country) => ({ id: item.country, country: item.country, label: item.country }))}
        disabled={!edit}
        isLoading={IsLoadingCountries}
        error={Countries?.length === 0 && countryInputValue.length !== 0 ? 'No countries' : ''}
      />
      {selectedCountry && (
        <FromSelectSearch<{ region: string }>
          value={selectedRegion ? { region: selectedRegion, label: selectedRegion } : null}
          label={t('form.region')}
          id={'region'}
          onChange={(_, newValue) => handleRegionSelect(newValue?.region || null)}
          inputValue={regionInputValue}
          onInputChange={(_, newInputValue) => setRegionInputValue(newInputValue)}
          options={filteredRegions.map(r => ({ id: r, region: r, label: r }))}
          error={regionInputValue && filteredRegions.length === 0 ? 'No regions' : ''}
          disabled={!edit || !selectedCountry}
        />
      )}
      {selectedCountry && selectedRegion && (
        <FromSelectSearch<{ city: string }>
          value={selectedCity ? { city: selectedCity, label: selectedCity } : null}
          label={t('form.city')}
          id={'city'}
          onChange={(_, newValue) => handleCitySelect(newValue?.city || null)}
          inputValue={cityInputValue}
          onInputChange={(_, newInputValue) => setCityInputValue(newInputValue)}
          options={filteredCities.map(c => ({ id: c, city: c, label: c }))}
          disabled={!edit || !selectedRegion}
          isLoading={IsLoadingRegions}
          error={cityInputValue && filteredCities.length === 0 ? 'No cities' : ''}
        />
      )}
    </React.Fragment>
  );
};
