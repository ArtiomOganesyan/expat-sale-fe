import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const categoriesAPI = createApi({
  reducerPath: "categoriesAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    getCategories: builder.query<any, any>({
      query: () => ({
        url: `/categories`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetCategoriesQuery } = categoriesAPI