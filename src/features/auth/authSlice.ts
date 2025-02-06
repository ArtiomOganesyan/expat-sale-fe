import { authAPI } from "./authAPI"
import { createAppSlice } from "../../app/createAppSlice"

const initialState: {
  user: any
  loading: boolean
  error: any
} = {
  user: null,
  loading: false,
  error: null,
}

export const authSlice = createAppSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    // CHECK IF USER IS LOGGED IN
    builder.addMatcher(authAPI.endpoints.authCheck.matchPending, state => {
      state.user = null
      state.loading = true
      state.error = null
    })
    builder.addMatcher(
      authAPI.endpoints.authCheck.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = action.payload
      },
    )
    builder.addMatcher(
      authAPI.endpoints.authCheck.matchRejected,
      (state, action) => {
        state.loading = false
        state.error = action.error?.message || "An error occurred."
      },
    )
    // LOGIN
    builder.addMatcher(
      authAPI.endpoints.login.matchPending,
      (state, action) => {
        state.loading = true
        state.error = null
        state.user = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.login.matchRejected,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload
      },
    )
    // REGISTER
    builder.addMatcher(
      authAPI.endpoints.register.matchPending,
      (state, action) => {
        state.loading = true
        state.error = null
        state.user = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.register.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.register.matchRejected,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload
      },
    )
    // LOGOUT
    builder.addMatcher(
      authAPI.endpoints.logout.matchPending,
      (state, action) => {
        state.loading = true
        state.error = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.logout.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.logout.matchRejected,
      (state, action) => {
        state.loading = false
        state.error = action.payload
      },
    )
  },
})

export const selectUser = (state: any) => state.authSlice.user
export const { reducer } = authSlice
