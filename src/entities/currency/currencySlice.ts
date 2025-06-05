import { createSlice } from "@reduxjs/toolkit"
import { currencyAPI } from "./currencyAPI"

export type CurrencyRateResponse = {
  id: string
  created_at: string
  updated_at: string
  iso_4217: string
  rate: string
  symbol: string
}

export type CurrencyRate = {
  iso: string
  symbol: string
  rate: number
}

const initialState: {
  rates: CurrencyRate[]
  loading: boolean
  error: any
} = {
  rates: [],
  loading: false,
  error: null,
}

export const currencySlice = createSlice({
  name: "currencySlice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      currencyAPI.endpoints.getCurrencyRate.matchPending,
      state => {
        state.rates = []
        state.loading = true
        state.error = null
      },
    )
    builder.addMatcher(
      currencyAPI.endpoints.getCurrencyRate.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.rates = action.payload.map((item: CurrencyRateResponse) => ({
          iso: item.iso_4217,
          symbol: item.symbol,
          rate: parseFloat(item.rate),
        }))
      },
    )
    builder.addMatcher(
      currencyAPI.endpoints.getCurrencyRate.matchRejected,
      (state, action) => {
        state.loading = false
        state.error = "An error occurred."
      },
    )
  },
})

export const getRates = (state: any) =>
  (state.currencySlice as typeof initialState).rates
export const { reducer } = currencySlice
