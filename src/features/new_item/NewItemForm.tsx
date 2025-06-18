import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, categoryToSubcategoriesMapping, CONDITION, SUBCATEGORIES } from '../../utils/constants/Item';
import { useAddImageToItemMutation, useCreateItemMutation } from '../../entities/items/itemAPI';

import styles from './NewItem.module.css';
import { prepareCategoryText } from '../../utils/prepareCategoryText';
import FormInput from '../../shared/components/FormInput/FormInput';
import FormSelect from '../../shared/components/FormSelect/FormSelect';
import FromSelectSearch from '../../shared/components/FormSelectSearch/FromSelectSearch';
import FormCheckBox from '../../shared/components/FormCheck/FormCheckBox';
import { formChangeHandler } from './utils/formChangeHandler';
import { useAppSelector } from '../../hooks/hooks';
import { getRates } from '../../entities/currency/currencySlice';
import FormFiles from '../../shared/components/FormFiles/FormFiles';
import Button from '@mui/material/Button';
import { getCategories } from '../../entities/categories/categoriesSlice';
import { useGetCitiesQuery, useGetRegionsQuery } from '../../entities/places/placesAPI';
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue';

function NewItemForm() {
  const [regionInputValue, setRegionInputValue] = useState<string>('');
  const [citiesList, setCitiesList] = useState<{ city: string; label: string }[]>();
  const [selectedCity, setSelectedCity] = useState<{ city: string; label: string; groupBy?: string } | null>(null);
  const [cityInputValue, setCityInputValue] = useState<string>('');
  const debouncedRegionInputValue = useDebouncedValue(regionInputValue, 1000);
  const debouncedCityInputValue = useDebouncedValue(cityInputValue, 1000);
  const skipRegionsQuery = debouncedRegionInputValue.length < 3;
  const skipCitiesQuery = debouncedCityInputValue.length < 3;
  const [create, createMeta] = useCreateItemMutation();
  const [addImage, addImageMeta] = useAddImageToItemMutation();
  const isLoading = createMeta.isLoading || addImageMeta.isLoading;
  const currencyRates = useAppSelector(getRates);
  const categories = useAppSelector(getCategories);
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'EUR',
    is_free: false,
    published: true,
    categoryId: CATEGORIES.OTHER,
    // subcategory: SUBCATEGORIES.OTHER,
    // condition: CONDITION.USED,
    is_new: false,
    location: {
      country: '',
      region: '',
      city: '',
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const { handleInputChange, handleSelectChange, handleCheckboxChange, handleLocationChange } = formChangeHandler(setFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // const priceInEUR = getEURPrice(formData.price, formData.currency)
    const result = await create({
      ...formData,
      // price: +priceInEUR,
      location: {
        radius: 0,
        country: '',
        region: formData.location.region,
        city: formData.location.city,
      },
      price: Number(formData.price),
      currency: 'EUR',
    });

    if (result.data) {
      const itemId = result.data.id;
      console.log('FILES BEFORE UPLOAD:', files);
      const addFilesResult = await addImage({ itemId, files });
    }
  };

  // const getEURPrice = (price: number, currency: string) => {
  //   const rate = currencyRates.find(r => r[0] === currency)
  //   if (rate) {
  //     return (price / rate[1]).toFixed(2)
  //   }
  //   return 0
  // }

  const subcategories = useMemo(() => {
    const sub_cat: {
      category: string;
      subcategory: string;
      subcategoryId: string;
      groupBy: string;
      label: string;
    }[] = [];

    categories.forEach(category => {
      category?.children?.forEach(child => {
        sub_cat.push({
          category: category.name,
          subcategory: child.name,
          subcategoryId: child.id,
          groupBy: prepareCategoryText(category.name),
          label: prepareCategoryText(child.name),
        });
      });
    });

    return sub_cat;
  }, [categories]);

  useEffect(() => {
    const regionCities = Regions?.reduce<{ city: string; label: string }[]>((acc, item) => {
      const citiesOptions = item.cities.map(city => ({
        city: city,
        label: city,
      }));

      return acc.concat(citiesOptions);
    }, []);
    setCitiesList(regionCities);
    setCityInputValue('');
    setSelectedCity(null);
  }, [Regions]);

  const handleChangeRegions = (value: string) => {
    setRegionInputValue(value);
    setCitiesList([]);
    setCityInputValue('');
    setFormData(prev => ({ ...prev, location: { ...prev.location, region: value, city: '' } }));
    // setSelectedCity(null);
  };

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label={'Title'}
          type={'text'}
          id={'title'}
          name={'title'}
          placeholder={'What do you want to sell?'}
          onChange={handleInputChange}
        />

        <FormInput
          label={'Description'}
          type={'text'}
          id='description'
          name='description'
          value={formData.description}
          placeholder='Describe your item'
          onChange={handleInputChange}
          options={{
            multiline: true,
            minRows: 4,
            maxRows: 8,
          }}
        />

        <div className={styles.price_block}>
          <FormInput
            label={'Price'}
            type={'number'}
            id={'price'}
            name={'price'}
            value={formData.price}
            onChange={handleInputChange}
          />
          {/* <FormSelect
            label="Currency"
            id={"currency"}
            onChange={(_, newValue) => {
              handleSelectChange("currency", newValue?.value || "EUR")
            }}
            options={currencyRates.map(r => ({
              value: r[0],
              label: r[0],
            }))}
          /> */}
          {/* <div>EUR Price: {getEURPrice(formData.price, formData.currency)}</div> */}
        </div>
        <FormSelect<{
          category: string;
          subcategoryId: string;
        }>
          label={'Category'}
          id={'category'}
          onChange={(_, newValue) => {
            handleSelectChange('categoryId', newValue?.subcategoryId || 'Other');
          }}
          options={subcategories}
        />

        <FormSelect
          label={'Condition'}
          id={'condition'}
          onChange={(_, newValue) => {
            const isNew = newValue?.value === 'new';
            handleSelectChange('is_new', isNew);
          }}
          options={Object.values(CONDITION).map(c => ({
            value: c,
            label: prepareCategoryText(c),
          }))}
        />
        <FromSelectSearch<{
          region: string;
        }>
          label={'Region'}
          id={'region'}
          onChange={(_, newValue) => {
            handleLocationChange('location', 'region', newValue?.region);
            // setRegionInputValue(newValue?.region || '');
          }}
          inputValue={regionInputValue}
          onInputChange={(_, newInputValue) => handleChangeRegions(newInputValue)}
          options={
            Regions
              ? Regions.map((item: any) => ({
                  id: item.region,
                  region: item.region,
                  label: item.region,
                }))
              : []
          }
          // disabled={IsLoadingRegions}
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
            setSelectedCity(newValue);
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
          disabled={!Regions || Regions?.length === 0}
          // isLoading={IsLoadingCities}
          error={Cities?.length === 0 && cityInputValue.length !== 0 ? 'No cities' : ''}
        />

        <div className={styles.item_option_block}>
          <FormCheckBox
            label={'Free'}
            id={'is_free'}
            name={'is_free'}
            checked={formData.is_free}
            onChange={(_, checked) => handleCheckboxChange('is_free', checked)}
          />
          <FormCheckBox
            label={'Published'}
            id={'published'}
            name={'published'}
            checked={formData.published}
            onChange={(_, checked) => handleCheckboxChange('published', checked)}
          />
        </div>

        <FormFiles
          files={files}
          setFiles={setFiles}
        />

        <Button
          sx={{ marginLeft: 'auto' }}
          type='submit'
          variant='contained'
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Item'}
        </Button>
      </form>
    </div>
  );
}

export default NewItemForm;
