import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, categoryToSubcategoriesMapping, CONDITION, SUBCATEGORIES } from '../../utils/constants/Item';
import { useAddImageToItemMutation, useCreateItemMutation } from '../../entities/items/itemAPI';

import styles from './NewItem.module.css';
import { prepareCategoryText } from '../../utils/prepareCategoryText';
import FormInput from '../../shared/FormInput/FormInput';
import FormSelect from '../../shared/FormSelect/FormSelect';
import FormCheckBox from '../../shared/FormCheck/FormCheckBox';
import { formChangeHandler } from './utils/formChangeHandler';
import { useAppSelector } from '../../hooks/hooks';
import { getRates } from '../../entities/currency/currencySlice';
import FormFiles from '../../shared/FormFiles/FormFiles';
import Button from '@mui/material/Button';
import { getCategories } from '../../entities/categories/categoriesSlice';

function NewItemForm() {
  const [create, createMeta] = useCreateItemMutation();
  const [addImage, addImageMeta] = useAddImageToItemMutation();
  const isLoading = createMeta.isLoading || addImageMeta.isLoading;
  const currencyRates = useAppSelector(getRates);
  const categories = useAppSelector(getCategories);

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
  });

  const [files, setFiles] = useState<File[]>([]);

  const { handleInputChange, handleSelectChange, handleCheckboxChange } = formChangeHandler(setFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // const priceInEUR = getEURPrice(formData.price, formData.currency)
    const result = await create({
      ...formData,
      // price: +priceInEUR,
      price: Number(formData.price),
      currency: 'EUR',
    });

    if (result.data) {
      const itemId = result.data.id;
      const addFilesResult = await Promise.allSettled(files.map(file => addImage({ itemId, file })));
    }
  };

  // const getEURPrice = (price: number, currency: string) => {
  //   const rate = currencyRates.find(r => r[0] === currency)
  //   if (rate) {
  //     return (price / rate[1]).toFixed(2)
  //   }
  //   return 0
  // }

  //старая реализация
  // const subcategories = useMemo(() => {
  //   const cat = Object.entries(categoryToSubcategoriesMapping);
  //   const sub_cat: any = [];
  //   cat.forEach(([category, value]) => {
  //     const subcategories = value.map(subcategory => ({
  //       category: category,
  //       subcategory: subcategory,
  //       groupBy: prepareCategoryText(category),
  //       label: prepareCategoryText(subcategory),
  //     }));
  //     sub_cat.push(...subcategories);
  //   });
  //   return sub_cat;
  // }, []);

  const subcategories = useMemo(() => {
    const sub_cat: {
      category: string;
      subcategory: string;
      subcategoryId: string;
      groupBy: string;
      label: string;
    }[] = [];

    categories.forEach(category => {
      category.children.forEach(child => {
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
          setFiles={files => setFiles(files)}
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
