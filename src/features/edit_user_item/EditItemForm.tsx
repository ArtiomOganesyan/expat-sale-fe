import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { useNavigate, useParams } from 'react-router';
import styles from './EditItemForm.module.css';
import FormInput from '../../shared/components/FormInput/FormInput';
import ImageContainer from './ui/ImageContainer';
import Actions from './ui/Actions';
import FormError from '../../shared/components/FormError/FormError';
import { IconButton, Paper } from '@mui/material';
import {
  useDeleteImageInItemMutation,
  useGetItemByIdQuery,
  useUpdateImageToItemMutation,
  useUpdateItemMutation,
} from '../../entities/items/itemAPI';
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
import { getRates } from '../../entities/currency/currencySlice';
import { getSelectedOption } from '../../utils/getSelectedOption';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { GradientCircularProgress } from '../../widget/Loading/LoadingCircle';

function EditItemData() {
  const params = useParams();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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
  const currencyRates = useAppSelector(getRates);
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
    // setSelectedCity(null);
  }, [Regions]);

  const { data: item, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const [images, setImages] = useState(item?.images || []);
  const [updateItemMutation, updateMeta] = useUpdateItemMutation();
  const [updateImageToItem] = useUpdateImageToItemMutation();
  const [deleteImageInItemMutation] = useDeleteImageInItemMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (item) {
      setUpdatedItem({
        location: {
          city: item.location.city,
          country: item.location.country,
          radius: item.location.radius,
          region: item.location.region,
        },
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
      setIsUploadingImage(true);
      if (item) {
        await updateImageToItem({
          id: item.id,
          formData,
        });

        const uploadedImage: Item['images'][number] = {
          id: Date.now().toString(),
          public_url: URL.createObjectURL(files[0]),
        };

        setImages(prev => [...prev, uploadedImage]);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const deleteItemImage = async (imageId: string) => {
    try {
      setImages(prev => prev.filter(img => img.id !== imageId));
      await deleteImageInItemMutation({ imageId }).unwrap();
    } catch (err) {
      console.error('Ошибка при удалении изображения:', err);
    } finally {
    }
  };

  const handleChangeRegions = (value: string) => {
    setRegionInputValue(value);
    setCitiesList([]);
    setCityInputValue('');
    setSelectedCity(null);
  };
  useEffect(() => {
    if (item?.images) {
      setImages(item.images);
    }
  }, [item?.images]);

  useEffect(() => {
    console.log(images);
  }, [images]);

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
          <div className={styles.images}>
            {images.map(img => (
              <ImageContainer
                edit={edit}
                key={img.id}
                image={img.public_url ?? ''}
                updateItemImage={updateItemImage}
                handleFileDeleteClick={() => deleteItemImage(img.id)}
                fileInputRef={fileInputRef}
                handleFileInputClick={handleFileInputClick}
              />
            ))}
            {isUploadingImage && (
              <div className={styles.loading}>
                <GradientCircularProgress />
              </div>
            )}
            {edit && (
              <>
                <IconButton
                  type='button'
                  onClick={handleFileInputClick}
                >
                  <AddPhotoAlternateIcon style={{ width: '100px', height: '100px' }} />
                </IconButton>
                <input
                  style={{
                    display: 'none',
                  }}
                  type='file'
                  name='image'
                  accept='image/*'
                  onChange={updateItemImage}
                  ref={fileInputRef}
                />
              </>
            )}
          </div>

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
            value={getSelectedOption(
              currencyRates.map(r => ({
                value: r.iso,
                label: r.symbol,
              })),
              'value',
              updatedItem?.currency
            )}
            label='Currency'
            id={'currency'}
            onChange={(_, newValue) => {
              handleSelectChange('currency', newValue?.value || 'EUR');
            }}
            options={currencyRates.map(r => ({
              value: r.iso,
              label: r.symbol,
            }))}
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
