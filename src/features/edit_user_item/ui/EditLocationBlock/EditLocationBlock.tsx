import React, { type FC, useEffect, useMemo, useState } from 'react';
import FromSelectSearch from '../../../../shared/components/FormSelectSearch/FromSelectSearch';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { useGetCitiesQuery, useGetCountriesQuery, useGetRegionsQuery } from '../../../../entities/places/placesAPI';
import { type EditItem } from '../../../../entities/items/types/items';

interface EditLocationBlockProps {
  className?: string;
  updatedItem?: EditItem;
  handleLocationChange: (parentKey: string, childKey: string, value: any) => void;
  edit: boolean;
}

export const EditLocationBlockBlock: FC<EditLocationBlockProps> = ({ updatedItem, handleLocationChange, edit }) => {
  const [countryInputValue, setCountryInputValue] = useState<string>('');
  const [regionInputValue, setRegionInputValue] = useState<string>('');
  const [regionsList, setRegionsList] = useState<{ region: string; label: string }[]>();
  const [citiesList, setCitiesList] = useState<{ city: string; label: string }[]>();
  const [cityInputValue, setCityInputValue] = useState<string>('');
  const debouncedCountryInputValue = useDebouncedValue(countryInputValue, 1000);
  const debouncedRegionInputValue = useDebouncedValue(regionInputValue, 1000);
  const debouncedCityInputValue = useDebouncedValue(cityInputValue, 1000);
  const skipCountriesQuery = debouncedCountryInputValue.length < 3;
  const skipRegionsQuery = debouncedRegionInputValue.length < 3;
  const skipCitiesQuery = debouncedCityInputValue.length < 3;

  const {
    data: Countries,
    isLoading: IsLoadingCountries,
    error: CountriesError,
  } = useGetCountriesQuery({ query: debouncedCountryInputValue }, { skip: skipCountriesQuery });
  const {
    data: Regions,
    isLoading: IsLoadingRegions,
    error: RegionsError,
  } = useGetRegionsQuery({ query: debouncedRegionInputValue }, { skip: skipRegionsQuery });
  const {
    data: Cities,
    isLoading: IsLoadingCities,
    error: CitiesError,
  } = useGetCitiesQuery({ query: debouncedCityInputValue }, { skip: skipCitiesQuery });

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
  }, [Countries]);

  useEffect(() => {
    if (!Regions || !regionInputValue) {
      setCitiesList([]);
      return;
    }

    const matchedRegion = Regions.find(region => region.region.toLowerCase() === regionInputValue.toLowerCase());

    if (matchedRegion) {
      const cityOptions = matchedRegion.cities.map(city => ({
        city,
        label: city,
      }));
      setCitiesList(cityOptions);
    } else {
      setCitiesList([]);
    }

    setCityInputValue('');
  }, [Regions, regionInputValue]);

  const filteredRegions = useMemo(() => {
    if (!Regions || regionInputValue.length < 1) return [];

    return Regions.map(r => r.region)
      .filter(region => region.toLowerCase().includes(regionInputValue.toLowerCase()))
      .map(region => ({
        region,
        label: region,
      }));
  }, [Regions, regionInputValue]);

  const filteredCities = useMemo(() => {
    if (!Regions || regionInputValue.length < 3 || cityInputValue.length < 1) return [];

    const matchedRegion = Regions.find(region => region.region.toLowerCase() === regionInputValue.toLowerCase());

    if (!matchedRegion) return [];

    return matchedRegion.cities
      .filter(city => city.toLowerCase().includes(cityInputValue.toLowerCase()))
      .map(city => ({
        city,
        label: city,
      }));
  }, [Regions, regionInputValue, cityInputValue]);

  const handleChangeCountry = (value: string) => {
    setCountryInputValue(value);
    setRegionsList([]);
    setRegionInputValue('');
  };
  const handleChangeRegions = (value: string) => {
    setRegionInputValue(value);
    setCitiesList([]);
    setCityInputValue('');
  };
  return (
    <React.Fragment>
      <FromSelectSearch<{
        country: string;
      }>
        value={
          updatedItem?.location?.country
            ? {
                country: updatedItem.location.country,
                label: updatedItem.location.country,
              }
            : null
        }
        label={'Country'}
        id={'country'}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'country', newValue?.country);
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
        disabled={!edit}
        isLoading={IsLoadingCountries}
        error={Countries?.length === 0 && countryInputValue.length !== 0 ? 'No countries' : ''}
      />
      <FromSelectSearch<{
        region: string;
      }>
        value={
          updatedItem?.location?.region
            ? {
                region: updatedItem.location.region,
                label: updatedItem.location.region,
              }
            : null
        }
        label={'Region'}
        id={'region'}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'region', newValue?.region);
        }}
        inputValue={regionInputValue}
        onInputChange={(_, newInputValue) => handleChangeRegions(newInputValue)}
        options={filteredRegions}
        error={regionsList?.length === 0 && regionInputValue.length !== 0 ? 'No regions' : ''}
        disabled={!edit || Countries?.length === 0}
      />
      <FromSelectSearch<{
        city: string;
      }>
        value={
          updatedItem?.location?.city
            ? {
                city: updatedItem.location.city,
                label: updatedItem.location.city,
              }
            : null
        }
        label={'City'}
        id={'city'}
        onChange={(_, newValue) => {
          handleLocationChange('location', 'city', newValue?.city);
          setCityInputValue(newValue?.label ?? '');
        }}
        // value={selectedCity}
        inputValue={cityInputValue}
        onInputChange={(_, newInputValue) => setCityInputValue(newInputValue)}
        options={filteredCities}
        disabled={!Regions || Regions?.length === 0 || !edit}
        error={Cities?.length === 0 && cityInputValue.length !== 0 ? 'No cities' : ''}
      />
    </React.Fragment>
  );
};
