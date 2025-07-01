import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyLogoutQuery } from '../../entities/user/authAPI';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUpdateUserAvatarMutation, useUpdateUserMutation } from '../../entities/user/userAPI';
import { useNavigate, useParams } from 'react-router';
import style from './EditItemForm.module.css';
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

function EditItemData() {
  const params = useParams();
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

  const { data: item, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const editItem: EditItem = {
    location: item?.location,
    id: item?.id,
    created_at: item?.created_at,
    updated_at: item?.updated_at,
    title: item?.title,
    description: item?.description,
    price: Number(item?.price),
    currency: item?.currency,
    is_free: item?.is_free,
    is_new: item?.is_new,
    published: item?.published,
    categoryId: item?.categoryId,
  };
  const [updateItemMutation, updateMeta] = useUpdateItemMutation();
  const [updateUserAvatarMutation, updateAvatarMeta] = useUpdateUserAvatarMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUpdatedItem(editItem);
  }, [item]);

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
        setUpdatedItem(() => editItem);
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
    console.log(data)

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }

  return (
    <Paper
      elevation={10}
      className={style.container}
    >
      <form>
        <div className={style.header}>
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
        <div className={style.break_line} />
        <div className={style.user_data}>
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
            label='Category'
            id='category'
            onChange={(_, newValue) => {
            handleSelectChange('categoryId', newValue?.subcategoryId || 'Other');
          }}
            options={subcategories}
            disabled={!edit}
          />
          {/* <FormSelect
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
          /> */}
          {/* <FromSelectSearch<{
            region: string;
          }>
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
            error={Cities?.length === 0 && cityInputValue.length !== 0 ? 'No cities' : ''}
          /> */}

          {/* <div className={styles.item_option_block}>
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
          </div> */}
        </div>
        <FormError error={error} />
      </form>
    </Paper>
  );
}

export default EditItemData;
