import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import TAG_TYPES from "../../store/constants/TagTypes"

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: "include",
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 })

export const placesApi = createApi({
  reducerPath: "placesApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: Object.values(TAG_TYPES),
  endpoints: () => ({}),
})