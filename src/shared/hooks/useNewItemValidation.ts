import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type NewItemFormData = {
  title: string;
  description: string;
  price: number | string;
  is_free: boolean;
  categoryId: string;
  location: { city: string; region: string; country: string; radius: number };
  currency: string;
  is_new: boolean;
  published: boolean;
};

type Errors = Partial<{
  title: string;
  description: string;
  price: string;
  categoryId: string;
}>;

export function useNewItemValidation(formData: NewItemFormData) {
  const { t } = useTranslation('item');
  const [errors, setErrors] = useState<Errors>({});

  const validateField = useCallback(
    (name: keyof Errors, value?: any): string | '' => {
      const v = value ?? (name === 'price' ? formData.price : (formData as any)[name]);

      switch (name) {
        case 'title':
          if (!String(v || '').trim()) return t('form.error.title');
          if (String(v).trim().length < 3) return t('form.error.title.characters');
          return '';
        case 'description':
          if (!String(v || '').trim()) return t('form.error.description');
          return '';
        case 'price':
          if (formData.is_free) return '';
          if (v === '' || v === null || Number.isNaN(Number(v))) return t('form.error.price');
          return '';
        case 'categoryId':
          if (!v) return t('form.error.category');
          return '';
        default:
          return '';
      }
    },
    [formData]
  );

  const validateAll = useCallback(() => {
    const next: Errors = {
      title: validateField('title'),
      description: validateField('description'),
      price: validateField('price'),
      categoryId: validateField('categoryId', formData.categoryId),
    };
    setErrors(next);
    const firstErrorKey = (Object.keys(next) as (keyof Errors)[]).find(k => next[k]);
    return { ok: !firstErrorKey, firstErrorKey };
  }, [formData, validateField]);

  const setFieldOk = useCallback((name: keyof Errors) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  return {
    errors,
    setErrors,
    validateField,
    validateAll,
    setFieldOk,
  };
}
