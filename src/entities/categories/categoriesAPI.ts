import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type Category } from './categories.type';
import TAG_TYPES from '../../store/constants/TagTypes';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const categoriesAPI = createApi({
  reducerPath: 'categoriesAPI',
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: 'include' }),
  tagTypes: [TAG_TYPES.CATEGORIES],
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
      transformResponse: (response: Category[]) =>
        response.sort((a, b) => {
          if (a.name === 'Others') return 1;
          if (b.name === 'Others') return -1;
          return a.name.localeCompare(b.name);
        }),
      providesTags: result => (result ? [{ type: TAG_TYPES.CATEGORIES, id: 'LIST' }] : []),
    }),
    getParentCategories: builder.query<Category[], void>({
      query: () => ({
        url: `categories/parents`,
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: Category[]) =>
        response.sort((a, b) => {
          if (a.name === 'Others') return 1;
          if (b.name === 'Others') return -1;
          return a.name.localeCompare(b.name);
        }),
      providesTags: result => (result ? [{ type: TAG_TYPES.CATEGORIES, id: 'PARENT-LIST' }] : []),
    }),
  }),
});

export const { useGetCategoriesQuery, useGetParentCategoriesQuery } = categoriesAPI;
