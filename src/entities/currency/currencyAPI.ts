import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { CurrencyRateResponse } from "./currencySlice"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const currencyAPI = createApi({
  reducerPath: "currencyAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    getCurrencyRate: builder.query<CurrencyRateResponse[], void>({
      query: () => ({
        url: `/currency`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetCurrencyRateQuery } = currencyAPI
