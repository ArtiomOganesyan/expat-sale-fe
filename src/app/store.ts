import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { counterSlice } from "../features/counter/counterSlice"
import { quotesApiSlice } from "../features/quotes/quotesApiSlice"
import { userSlice } from "../features/user/userSlice"
import { authAPI } from "../features/auth/authAPI"
import { userAPI } from "../features/user/userAPI"
// import { ExpatSaleApi } from "./api"

const rootReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  userSlice,
  userAPI,
  authAPI,
  // ExpatSaleApi,
)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(
        quotesApiSlice.middleware,
        authAPI.middleware,
        userAPI.middleware,
        // ExpatSaleApi.middleware,
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
