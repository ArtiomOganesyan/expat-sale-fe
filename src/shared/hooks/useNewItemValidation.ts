import { useState, useCallback } from 'react';

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
  const [errors, setErrors] = useState<Errors>({});

  const validateField = useCallback(
    (name: keyof Errors, value?: any): string | '' => {
      const v = value ?? (name === 'price' ? formData.price : (formData as any)[name]);

      switch (name) {
        case 'title':
          if (!String(v || '').trim()) return 'Title is required';
          if (String(v).trim().length < 3) return 'Title must be at least 3 characters';
          return '';
        case 'description':
          if (!String(v || '').trim()) return 'Description is required';
          return '';
        case 'price':
          if (formData.is_free) return '';
          if (v === '' || v === null || Number.isNaN(Number(v))) return 'Price is required';
          if (Number(v) <= 0) return 'Price must be greater than 0';
          return '';
        case 'categoryId':
          if (!v) return 'Category is required';
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
