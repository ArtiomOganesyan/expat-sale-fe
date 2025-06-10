import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { type Category } from "./category.type"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const categoryAPI = createApi({
  reducerPath: "categoryAPI",
  tagTypes: ["Categories"],
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    getParentCategories: builder.query<Category[], void>({
      query: () => ({
        url: `categories/parents`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: result =>
        result ? [{ type: "Categories", id: "PARENT-LIST" }] : [],
    }),
  }),
})

export const { useGetParentCategoriesQuery } = categoryAPI
