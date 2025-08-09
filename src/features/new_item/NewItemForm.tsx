import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants/Item';
import { useAddImageToItemMutation, useCreateItemMutation } from '../../entities/items/itemAPI';

import styles from './NewItem.module.css';
import FormInput from '../../shared/components/FormInput/FormInput';
import FormCheckBox from '../../shared/components/FormCheck/FormCheckBox';
import { formChangeHandler } from './utils/formChangeHandler';
import FormFiles from '../../shared/components/FormFiles/FormFiles';
import Button from '@mui/material/Button';
import { NewItemLocation } from './ui/NewItemLocation/NewItemLocation';
import { NewItemCondition } from './ui/NewItemCondition/NewItemCondition';
import { NewItemCategory } from './ui/NewItemCategory/NewItemCategory';
import { NewItemCurrency } from './ui/NewItemCurrency/NewItemCurrency';
import { NewItemDistance } from './ui/NewItemDistance/NewItemDistance';
import { useSnackbar } from '../../shared/hooks/useSnackbar';
import { useNavigate } from 'react-router';

function NewItemForm() {
  const [create, createMeta] = useCreateItemMutation();
  const [addImage, addImageMeta] = useAddImageToItemMutation();
  const isLoading = createMeta.isLoading || addImageMeta.isLoading;
  const navigate = useNavigate();

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
      radius: 0,
      country: '',
      region: '',
      city: '',
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const { handleInputChange, handleSelectChange, handleCheckboxChange, handleLocationChange } = formChangeHandler(setFormData);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const priceInEUR = getEURPrice(formData.price, formData.currency)
    const result = await create({
      ...formData,
      // price: +priceInEUR,
      location: {
        radius: formData.location.radius,
        country: formData.location.country,
        region: formData.location.region,
        city: formData.location.city,
      },
      price: Number(formData.price),
      currency: formData.currency,
    });

    if ('error' in result) {
      showSnackbar({
        title: 'Error creating item',
        subtitle: 'Please check the form or try again later',
        severity: 'error',
      });
      return;
    }

    if (result.data) {
      const itemId = result.data.id;
      const addFilesResult = await addImage({ itemId, files });
      showSnackbar({
        title: 'Item created',
        subtitle: 'Your item has been successfully added',
        severity: 'success',
      });
      navigate('/profile/userItemsList');
    }
  };

  // const getEURPrice = (price: number, currency: string) => {
  //   const rate = currencyRates.find(r => r[0] === currency)
  //   if (rate) {
  //     return (price / rate[1]).toFixed(2)
  //   }
  //   return 0
  // }

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
          <NewItemCurrency
            handleSelectChange={handleSelectChange}
            formData={formData}
          />
          {/* <div>EUR Price: {getEURPrice(formData.price, formData.currency)}</div> */}
        </div>
        <NewItemCategory
          handleSelectChange={handleSelectChange}
          formData={formData}
        />
        <NewItemCondition
          handleSelectChange={handleSelectChange}
          formData={formData}
        />

        <NewItemLocation
          handleLocationChange={handleLocationChange}
          setFormData={setFormData}
        />
        <NewItemDistance handleLocationChange={handleLocationChange} />
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
