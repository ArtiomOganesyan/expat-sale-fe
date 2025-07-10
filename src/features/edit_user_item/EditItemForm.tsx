import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './EditItemForm.module.css';
import FormInput from '../../shared/components/FormInput/FormInput';
import Actions from './ui/Actions/Actions';
import FormError from '../../shared/components/FormError/FormError';
import { Paper } from '@mui/material';
import {
  useGetItemByIdQuery,
  useUpdateItemMutation,
} from '../../entities/items/itemAPI';
import { EditItem } from '../../entities/items/items.type';
import FormCheckBox from '../../shared/components/FormCheck/FormCheckBox';
import { formChangeHandler } from './utils/formChangeHandler';
import { EditImageBlock } from './ui/EditImageBlock/EditImageBlock';
import { EditCurrencyBlock } from './ui/EditCurrencyBlock/EditCurrencyBlock';
import { EditCategoryBlock } from './ui/EditCategoryBlock/EditCategoryBlock';
import { EditConditionBlock } from './ui/EditConditionBlock/EditConditionBlock';
import { EditLocationBlockBlock } from './ui/EditLocationBlock/EditLocationBlock';
import { EditDistanceBlock } from './ui/EditDistanceBlock/EditDistanceBlock';

function EditItemData() {
  const params = useParams();
  const { data: item, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const [updatedItem, setUpdatedItem] = useState<EditItem | undefined>();
  const { handleInputChange, handleSelectChange, handleCheckboxChange, handleLocationChange } = formChangeHandler(setUpdatedItem);
  const [updateItemMutation, updateMeta] = useUpdateItemMutation();
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');

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
          <EditImageBlock
            className={styles.images}
            item={item}
            edit={edit}
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
          <EditCurrencyBlock
            updatedItem={updatedItem}
            handleSelectChange={handleSelectChange}
            edit={edit}
          />

          <EditCategoryBlock
            updatedItem={updatedItem}
            handleSelectChange={handleSelectChange}
            edit={edit}
          />

          <EditConditionBlock
            updatedItem={updatedItem}
            handleSelectChange={handleSelectChange}
            edit={edit}
          />

          <EditLocationBlockBlock
            updatedItem={updatedItem}
            handleLocationChange={handleLocationChange}
            edit={edit}
          />

          {updatedItem && <EditDistanceBlock
            updatedItem={updatedItem}
            handleLocationChange={handleLocationChange}
            edit={edit}
          />}

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
