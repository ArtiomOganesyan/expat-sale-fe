import { useState, useRef, useEffect } from 'react';
import { useIsServiceCategory } from '../../shared/hooks/useIsServiceCategory';
import {
  useAddImageToItemMutation,
  useCreateItemMutation,
  useLazyGetPriceListTemplateQuery,
  useUploadPriceListMutation,
} from '../../entities/items/itemAPI';

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
import { LOCAL_STORAGE_KEY_CURRENCY } from '../../utils/constants/Item';
import { useNewItemValidation } from '../../shared/hooks/useNewItemValidation';
import { Stack, Typography } from '@mui/material';
import FromPriceListUpload from '../../shared/components/FormPriceListUpload/FromPriceListUpload';
import { safeLang } from '../../utils/saveLang';

function NewItemForm() {
  const [create, createMeta] = useCreateItemMutation();
  const [getPriceListTemplate, { isFetching }] = useLazyGetPriceListTemplateQuery();
  const [uploadPriceList, uploadMeta] = useUploadPriceListMutation();
  const [priceListFile, setPriceListFile] = useState<File | null>(null);
  const [addImage, addImageMeta] = useAddImageToItemMutation();
  const isLoading = createMeta.isLoading || addImageMeta.isLoading;
  const navigate = useNavigate();
  const savedCurrency = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENCY) || 'usd';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: savedCurrency,
    is_free: false,
    published: true,
    categoryId: '',
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

  const { errors, validateField, validateAll, setErrors, setFieldOk } = useNewItemValidation(formData);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const isService = useIsServiceCategory(formData.categoryId);

  useEffect(() => {
    if (isService) {
      setFieldOk('price');
    }
  }, [isService, setFieldOk]);

  const createOnBlur = (field: keyof typeof errors, extraValue?: any) => () => {
    const msg = validateField(field, extraValue ?? formData[field]);
    setErrors(prev => ({ ...prev, [field]: msg }));
  };

  const onBlurTitle = createOnBlur('title');
  const onBlurDesc = createOnBlur('description');
  const onBlurPrice = createOnBlur('price');
  const onBlurCategoryId = createOnBlur('categoryId', formData.categoryId);

  const handleIsFreeToggle = (_: any, checked: boolean) => {
    handleCheckboxChange('is_free', checked);
    setFieldOk('price');
  };

  const handleGetTemplate = async () => {
    try {
      const csvText = await getPriceListTemplate().unwrap();
      const fileName = `price-list-template_${safeLang()}.csv`;

      try {
        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error('Не удалось скачать шаблон прайс-листа', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ok, firstErrorKey } = validateAll();
    if (!ok) {
      showSnackbar({
        title: 'Missing required fields',
        subtitle: 'Please fix highlighted inputs',
        severity: 'warning',
      });

      const map: Record<string, HTMLInputElement | null> = {
        title: titleRef.current,
        description: descRef.current,
        price: priceRef.current,
      };

      const el = map[firstErrorKey || 'title'];
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const result = await create({
      ...formData,
      // price: +priceInEUR,
      location: {
        radius: formData.location.radius,
        country: formData.location.country,
        region: formData.location.region,
        city: formData.location.city,
      },
      price: isService ? 0 : Number(formData.price),
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
      if (priceListFile) {
        try {
          await uploadPriceList({ itemId, file: priceListFile }).unwrap();
        } catch (err: any) {
          showSnackbar({
            title: 'Price list upload failed',
            subtitle: err?.data?.message || 'Please try again later',
            severity: 'error',
          });
        }
      }
      await addImage({ itemId, files });
      showSnackbar({
        title: 'Item created',
        subtitle: 'Your item has been successfully added',
        severity: 'success',
      });
      navigate('/profile/userItemsList');
    }
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
          onBlur={onBlurTitle}
          error={Boolean(errors.title)}
          helperText={errors.title}
          inputRef={titleRef}
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
          onBlur={onBlurDesc}
          error={Boolean(errors.description)}
          helperText={errors.description}
          inputRef={descRef}
        />
        <NewItemCategory
          handleSelectChange={handleSelectChange}
          formData={formData}
          error={Boolean(errors.categoryId)}
          helperText={errors.categoryId}
          onBlur={onBlurCategoryId}
        />
        {!isService && (
          <div className={styles.price_block}>
            <FormInput
              label={'Price'}
              type={'number'}
              id={'price'}
              name={'price'}
              value={formData.price}
              onChange={handleInputChange}
              onBlur={onBlurPrice}
              error={Boolean(errors.price)}
              helperText={errors.price}
              disabled={formData.is_free}
              inputRef={priceRef}
            />
            <NewItemCurrency
              handleSelectChange={handleSelectChange}
              formData={formData}
            />
          </div>
        )}
        {!isService && (
          <NewItemCondition
            handleSelectChange={handleSelectChange}
            formData={formData}
          />
        )}
        <NewItemLocation
          handleLocationChange={handleLocationChange}
          setFormData={setFormData}
        />
        {isService && (
          <Stack
            width={'100%'}
            gap={2}
          >
            <FromPriceListUpload
              file={priceListFile}
              setFile={setPriceListFile}
            />
            <Typography
              fontSize={20}
              fontWeight={500}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleGetTemplate()}
            >
              {isFetching ? 'Downloading…' : 'Download the price list template'}
            </Typography>
          </Stack>
        )}
        <NewItemDistance handleLocationChange={handleLocationChange} />
        <div className={styles.item_option_block}>
          <FormCheckBox
            label={'Free'}
            id={'is_free'}
            name={'is_free'}
            checked={formData.is_free}
            onChange={handleIsFreeToggle}
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
function resolveLangForFileName() {
  throw new Error('Function not implemented.');
}
