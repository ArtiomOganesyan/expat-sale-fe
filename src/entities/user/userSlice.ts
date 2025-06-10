import { authAPI } from "./authAPI"
import { createAppSlice } from "../../store/utils/createAppSlice"
import { userAPI } from "./userAPI"
// import { createSlice } from "@reduxjs/toolkit"
import { type UserSliceState, type User } from "./user.type"
import { type RootState } from "../../store/store"

const initialState: UserSliceState = {
  user: null,
  loading: false,
  error: undefined,
}

export const userSlice = createAppSlice({
  name: "userSlice",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const user = state?.user
      if (user) state.user = { ...user, ...action.payload }
      else state.user = action.payload as User
    },
  },
  extraReducers: builder => {
    // CHECK IF USER IS LOGGED IN
    builder.addMatcher(authAPI.endpoints.authCheck.matchPending, state => {
      state.user = null
      state.loading = true
      state.error = undefined
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
        state.error = undefined
        state.user = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = undefined
      },
    )
    builder.addMatcher(
      authAPI.endpoints.login.matchRejected,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.error?.message || "An error occurred."
      },
    )
    // REGISTER
    builder.addMatcher(
      authAPI.endpoints.register.matchPending,
      (state, action) => {
        state.loading = true
        state.error = undefined
        state.user = null
      },
    )
    builder.addMatcher(
      authAPI.endpoints.register.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = undefined
      },
    )
    builder.addMatcher(
      authAPI.endpoints.register.matchRejected,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.error?.message || "An error occurred."
      },
    )
    // LOGOUT
    builder.addMatcher(
      authAPI.endpoints.logout.matchPending,
      (state, action) => {
        state.loading = true
        state.error = undefined
      },
    )
    builder.addMatcher(
      authAPI.endpoints.logout.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.user = null
        state.error = undefined
      },
    )
    builder.addMatcher(
      authAPI.endpoints.logout.matchRejected,
      (state, action) => {
        state.loading = false
        state.error = action.error?.message || "An error occurred."
      },
    )
    // PROFILE UPDATE
    builder.addMatcher(
      userAPI.endpoints.updateUser.matchPending,
      (state, action) => {
        state.loading = true
        state.error = undefined
      },
    )
    builder.addMatcher(
      userAPI.endpoints.updateUser.matchRejected,
      (state, action) => {
        state.loading = true
        state.error = action.error?.message || "An error occurred."
      },
    )
    builder.addMatcher(
      userAPI.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.error = undefined
        state.user = action.payload
      },
    )
    // AVATAR UPDATE
    builder.addMatcher(
      userAPI.endpoints.updateUserAvatar.matchPending,
      (state, action) => {
        state.loading = true
        state.error = undefined
      },
    )
    builder.addMatcher(
      userAPI.endpoints.updateUserAvatar.matchRejected,
      (state, action) => {
        state.loading = true
        state.error = action.error?.message || "An error occurred."
      },
    )
    builder.addMatcher(
      userAPI.endpoints.updateUserAvatar.matchFulfilled,
      (state, action) => {
        state.loading = false
        state.error = undefined

        console.log("Avatar updated:", action.payload, { state })

        if (state.user) {
          state.user = { ...state.user, image: action.payload }
        }
      },
    )
  },
})

export const selectUser = (state: RootState) => state.userSlice.user
export const { updateUser } = userSlice.actions
export const { reducer } = userSlice
