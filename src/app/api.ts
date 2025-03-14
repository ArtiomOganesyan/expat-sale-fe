import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import TAG_TYPES from "./constants/TagTypes"

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 })

export const ExpatSaleApi = createApi({
  reducerPath: "ExpatSaleAPI",
  baseQuery: baseQueryWithRetry,
  tagTypes: Object.values(TAG_TYPES),
  endpoints: () => ({}),
})
