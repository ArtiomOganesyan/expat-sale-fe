import React, { FC, useEffect, useMemo, useState } from 'react';
import FromSelectSearch from '../../../../shared/components/FormSelectSearch/FromSelectSearch';
import { useGetCountriesQuery, useGetRegionsQuery } from '../../../../entities/places/placesAPI';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';

interface NewItemLocationProps {
  className?: string;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const NewItemLocation: FC<NewItemLocationProps> = ({ className, handleLocationChange, setFormData }) => {
  const [countryInputValue, setCountryInputValue] = useState<string>('');
  const [regionInputValue, setRegionInputValue] = useState<string>('');
  const [regionsList, setRegionsList] = useState<{ region: string; label: string }[]>();
  const [selectedRegion, setSelectedRegion] = useState<{ region: string; label: string; groupBy?: string } | null>(null);
  const [citiesList, setCitiesList] = useState<{ city: string; label: string }[]>();
  const [selectedCity, setSelectedCity] = useState<{ city: string; label: string; groupBy?: string } | null>(null);
  const [cityInputValue, setCityInputValue] = useState<string>('');
  const debouncedCountryInputValue = useDebouncedValue(countryInputValue, 1000);
  const debouncedRegionInputValue = useDebouncedValue(regionInputValue, 1000);
  const skipCountriesQuery = debouncedCountryInputValue.length < 3;
  const skipRegionsQuery = debouncedRegionInputValue.length < 3;

  const { data: Countries, isLoading: IsLoadingCountries } = useGetCountriesQuery(
    { query: debouncedCountryInputValue },
    { skip: skipCountriesQuery }
  );
  const { data: Regions, isLoading: IsLoadingRegions } = useGetRegionsQuery(
    { query: debouncedRegionInputValue },
    { skip: skipRegionsQuery }
  );
  useEffect(() => {
    const countryRegions = Countries?.reduce<{ region: string; label: string }[]>((acc, item) => {
      const regionsOptions = item.regions.map(region => ({
        region: region,
        label: region,
      }));

      return acc.concat(regionsOptions);
    }, []);
    setRegionsList(countryRegions);
    setRegionInputValue('');
    setSelectedRegion(null);
  }, [Countries]);

  useEffect(() => {
    const matchedRegion = Regions?.find(r => r.region === selectedRegion?.region);
    if (matchedRegion) {
      const filteredCities = matchedRegion.cities
        .filter(city => city.toLowerCase().includes(cityInputValue.toLowerCase()))
        .map(city => ({
          city: city,
          label: city,
        }));
      setCitiesList(filteredCities);
    } else {
      setCitiesList([]);
    }
  }, [selectedRegion, cityInputValue, Regions]);

  const filteredRegionsList = useMemo(() => {
    if (!regionsList) return [];
    return regionsList.filter(region => region.label.toLowerCase().includes(regionInputValue.toLowerCase()));
  }, [regionsList, regionInputValue]);

  const handleChangeCountry = (value: string) => {
    setCountryInputValue(value);
    setRegionsList([]);
    setRegionInputValue('');
    setFormData((prev: any) => ({ ...prev, location: { ...prev.location, country: value, region: '' } }));
  };
  const handleChangeRegions = (value: string) => {
    setRegionInputValue(value);
    setCitiesList([]);
    setCityInputValue('');
    setFormData((prev: any) => ({ ...prev, location: { ...prev.location, region: value, city: '' } }));
  };
  return (
    <React.Fragment>
      <FromSelectSearch<{
        country: string;
      }>
        label={'Country'}
        id={'country'}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'country', newValue?.country);
          // setCountryInputValue(newValue?.label ?? '');
          // setRegionInputValue(newValue?.region || '');
        }}
        inputValue={countryInputValue}
        onInputChange={(_, newInputValue) => handleChangeCountry(newInputValue)}
        options={
          Countries
            ? Countries.map((item: any) => ({
                id: item.country,
                country: item.country,
                label: item.country,
              }))
            : []
        }
        isLoading={IsLoadingCountries}
        error={Countries?.length === 0 && countryInputValue.length !== 0 ? 'No countries' : ''}
      />
      <FromSelectSearch<{
        region: string;
      }>
        label={'Region'}
        id={'region'}
        onChange={(_, newValue) => {
          setSelectedRegion(newValue || null);
          handleLocationChange('location', 'region', newValue?.region);
          // setRegionInputValue(newValue?.label ?? '');
        }}
        inputValue={regionInputValue}
        onInputChange={(_, newInputValue) => handleChangeRegions(newInputValue)}
        options={filteredRegionsList.map(item => ({
          id: item.region,
          region: item.region,
          label: item.label,
        }))}
        disabled={!Countries || Countries?.length === 0}
        isLoading={IsLoadingRegions}
        error={Regions?.length === 0 && regionInputValue.length !== 0 ? 'No regions' : ''}
      />
      <FromSelectSearch<{
        city: string;
      }>
        label={'City'}
        id={'city'}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'city', newValue?.city);
          setSelectedCity(newValue || null);
          setCityInputValue(newValue?.label ?? '');
        }}
        value={selectedCity}
        inputValue={cityInputValue}
        onInputChange={(_, newInputValue) => setCityInputValue(newInputValue)}
        options={
          citiesList
            ? citiesList.map((item: any) => ({
                city: item.city,
                label: item.label,
              }))
            : []
        }
        disabled={!selectedRegion}
        error={cityInputValue.length !== 0 && (citiesList?.length ?? 0) === 0 ? 'No cities' : ''}
      />
    </React.Fragment>
  );
};
