import { createSlice } from "@reduxjs/toolkit"
import { currencyAPI } from "./currencyAPI"

const initialState: {
  rates: [string, number][]
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
        state.rates = Object.entries(action.payload.Rates)
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
