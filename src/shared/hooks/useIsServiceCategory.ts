import { useMemo } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { getCategories } from '../../entities/categories/categoriesSlice';
import type { Category } from '../../entities/categories/categories.type';

const toLower = (s?: string) => (s ?? '').toLowerCase();

export const isServiceByCategoryId = (
  categories: Category[] = [],
  categoryId?: string | null,
  targetSlug = 'services'
): boolean => {
  if (!categoryId) return false;
  const parent = categories.find(c => c.children?.some(ch => ch.id === categoryId));
  if (!parent) return false;
  const slug = toLower(parent.slug);
  const name = toLower(parent.name);
  return slug === targetSlug || name === targetSlug;
};

export const useIsServiceCategory = (
  categoryId?: string | null,
  targetSlug = 'services'
): boolean => {
  const categories = useAppSelector(getCategories);
  return useMemo(
    () => isServiceByCategoryId(categories, categoryId, targetSlug),
    [categories, categoryId, targetSlug]
  );
};
