import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyLogoutQuery } from '../../entities/user/authAPI';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUpdateUserAvatarMutation, useUpdateUserMutation } from '../../entities/user/userAPI';
import { useNavigate, useParams } from 'react-router';
import styles from './EditItemForm.module.css';
import FormInput from '../../shared/components/FormInput/FormInput';
import ImageContainer from './ui/ImageContainer';
import Actions from './ui/Actions';
import FormError from '../../shared/components/FormError/FormError';
import { Paper } from '@mui/material';
import { type User } from '../../entities/user/user.type';
import { useGetItemByIdQuery, useUpdateItemMutation } from '../../entities/items/itemAPI';
import { EditItem, Item } from '../../entities/items/items.type';
import FormCheckBox from '../../shared/components/FormCheck/FormCheckBox';
import FormSelect from '../../shared/components/FormSelect/FormSelect';
import { getCategories } from '../../entities/categories/categoriesSlice';
import { prepareCategoryText } from '../../utils/prepareCategoryText';
import { formChangeHandler } from './utils/formChangeHandler';
import { CONDITION } from '../../utils/constants/Item';
import FromSelectSearch from '../../shared/components/FormSelectSearch/FromSelectSearch';
import { useGetCitiesQuery, useGetRegionsQuery } from '../../entities/places/placesAPI';
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue';

function EditItemData() {
  const params = useParams();
  const [regionInputValue, setRegionInputValue] = useState<string>('');
  const [citiesList, setCitiesList] = useState<{ city: string; label: string }[]>();
  const [selectedCity, setSelectedCity] = useState<{ city: string; label: string; groupBy?: string } | null>(null);
  const [cityInputValue, setCityInputValue] = useState<string>('');
  const debouncedRegionInputValue = useDebouncedValue(regionInputValue, 1000);
  const debouncedCityInputValue = useDebouncedValue(cityInputValue, 1000);
  const skipRegionsQuery = debouncedRegionInputValue.length < 3;
  const skipCitiesQuery = debouncedCityInputValue.length < 3;
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [updatedItem, setUpdatedItem] = useState<EditItem | undefined>();
  const { handleInputChange, handleSelectChange, handleCheckboxChange, handleLocationChange } = formChangeHandler(setUpdatedItem);
  const categories = useAppSelector(getCategories);
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

  const { data: item, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const [updateItemMutation, updateMeta] = useUpdateItemMutation();
  const [updateUserAvatarMutation, updateAvatarMeta] = useUpdateUserAvatarMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (item) {
      setUpdatedItem({
        location: item.location,
        id: item.id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        title: item.title,
        description: item.description,
        price: Number(item.price),
        currency: item.currency,
        is_free: item.is_free,
        is_new: item.is_new,
        published: item.published,
        categoryId: item.category?.id,
      });
    }
  }, [item]);
  const selectedCategory = useMemo(() => {
    if (!updatedItem?.categoryId) return null;
    return subcategories.find(cat => cat.subcategoryId === updatedItem.categoryId) || null;
  }, [subcategories, updatedItem?.categoryId]);

  const selectedCondition = useMemo(() => {
    if (updatedItem?.is_new === undefined) return null;
    const value = updatedItem.is_new ? CONDITION.NEW : CONDITION.USED;
    return {
      value,
      label: prepareCategoryText(value),
    };
  }, [updatedItem?.is_new]);

  useEffect(() => {
    if (updateMeta.isError) {
      setError((updateMeta?.error as any)?.data?.error || 'An error occurred.');

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [updateMeta]);

  const handleEdit = () => {
    setEdit(bool => {
      if (bool) {
        setUpdatedItem(() => updatedItem);
      }
      return !bool;
    });
  };

  const handleEditSave = () => {
    setEdit(false);

    const data = { ...updatedItem };

    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    // delete data.image;
    // delete data.role;
    console.log(data);

    if (item) {
      updateItemMutation({ id: item?.id, data });
    }
  };

  // const handleUpdateUserContacts = (e: ChangeEvent<HTMLInputElement>) => {
  //   setUpdatedItem(prev => (prev ? { ...prev, contact_platforms: { [e.target.name]: e.target.value } } : prev));
  // };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateItemImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      if (item) {
        await updateUserAvatarMutation({
          id: item.id,
          entity: 'item',
          formData,
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleChangeRegions = (value: string) => {
    setRegionInputValue(value);
    setCitiesList([]);
    setCityInputValue('');
    setUpdatedItem(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        location: {
          ...prev.location,
          region: value,
          city: '',
          radius: prev.location?.radius ?? 0,
          country: prev.location?.country ?? '',
        },
      };
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }

  return (
    <Paper
      elevation={10}
      className={styles.container}
    >
      <form>
        <div className={styles.header}>
          <ImageContainer
            image={item?.images[0].public_url ?? ''}
            updateItemImage={updateItemImage}
            fileInputRef={fileInputRef}
            handleFileInputClick={handleFileInputClick}
          />

          <FormInput
            id='title'
            label='Title'
            type='text'
            name='title'
            placeholder='Title'
            value={updatedItem?.title || ''}
            disabled={!edit}
            onChange={handleInputChange}
          />

          <Actions
            edit={edit}
            updateMeta={updateMeta}
            handleEdit={handleEdit}
            handleEditSave={handleEditSave}
          />
        </div>
        <div className={styles.break_line} />
        <div className={styles.user_data}>
          <FormInput
            id='description'
            type='text'
            label='Description'
            placeholder='Description'
            name='description'
            value={updatedItem?.description || ''}
            disabled={!edit}
            onChange={handleInputChange}
          />
          <FormInput
            label={'Price'}
            type={'number'}
            id={'price'}
            name={'price'}
            disabled={!edit}
            value={updatedItem?.price || ''}
            onChange={handleInputChange}
          />
          <FormSelect
            value={selectedCategory}
            label='Category'
            id='category'
            onChange={(_, newValue) => {
              handleSelectChange('categoryId', newValue?.subcategoryId || 'Other');
            }}
            options={subcategories}
            disabled={!edit}
          />
          <FormSelect
            value={selectedCondition}
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
            disabled={!edit}
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
            options={
              Regions
                ? Regions.map((item: any) => ({
                    id: item.region,
                    region: item.region,
                    label: item.region,
                  }))
                : []
            }
            isLoading={IsLoadingRegions}
            error={Regions?.length === 0 && regionInputValue.length !== 0 ? 'No regions' : ''}
            disabled={!edit}
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
              setSelectedCity(newValue);
              setCityInputValue(newValue?.label ?? '');
            }}
            // value={selectedCity}
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
            disabled={!Regions || Regions?.length === 0 || !edit}
            error={Cities?.length === 0 && cityInputValue.length !== 0 ? 'No cities' : ''}
          />

          {updatedItem && (
            <div className={styles.item_option_block}>
              <FormCheckBox
                label={'Free'}
                id={'is_free'}
                name={'is_free'}
                checked={updatedItem.is_free}
                onChange={(_, checked) => handleCheckboxChange('is_free', checked)}
                disabled={!edit}
              />
              <FormCheckBox
                label={'Published'}
                id={'published'}
                name={'published'}
                checked={updatedItem.published}
                onChange={(_, checked) => handleCheckboxChange('published', checked)}
                disabled={!edit}
              />
            </div>
          )}
        </div>
        <FormError error={error} />
      </form>
    </Paper>
  );
}

export default EditItemData;
