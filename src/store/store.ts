import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { userSlice } from "../entities/user/userSlice"
import { authAPI } from "../entities/user/authAPI"
import { userAPI } from "../entities/user/userAPI"
import { listingApi } from "../entities/items/api"
import { currencyAPI } from "../entities/currency/currencyAPI"
import { currencySlice } from "../entities/currency/currencySlice"
import { categoriesAPI } from "../entities/categories/categoriesAPI"
import { categoriesSlice } from "../entities/categories/categoriesSlice"

const rootReducer = combineSlices(
  userSlice,
  userAPI,
  authAPI,
  listingApi,
  currencySlice,
  currencyAPI,
  categoriesAPI,
  categoriesSlice,
)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(
        authAPI.middleware,
        userAPI.middleware,
        listingApi.middleware,
        currencyAPI.middleware,
        categoriesAPI.middleware,
      )
    },
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
