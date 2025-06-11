import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type Category } from './categories.type';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const categoriesAPI = createApi({
  reducerPath: 'categoriesAPI',
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: 'include' }),
  tagTypes: ['Categories'],
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
    }),
    getParentCategories: builder.query<Category[], void>({
      query: () => ({
        url: `categories/parents`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: result => (result ? [{ type: 'Categories', id: 'PARENT-LIST' }] : []),
    }),
  }),
});

export const { useGetCategoriesQuery, useGetParentCategoriesQuery } = categoriesAPI;
