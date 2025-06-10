import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { type User } from "./user.type"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const authAPI = createApi({
  reducerPath: "authAPI",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    authCheck: builder.query<User, void>({
      query: () => ({
        url: `auth`,
        method: "GET",
        credentials: "include",
      }),
    }),
    login: builder.mutation<User, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: `auth/login`,
        method: "POST",
        body: { username, password },
        credentials: "include",
      }),
    }),
    register: builder.mutation<User, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: `auth/register`,
        method: "POST",
        body: { username, password },
        credentials: "include",
      }),
    }),
    logout: builder.query<any, void>({
      query: () => ({
        url: `auth`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
})

export const {
  useAuthCheckQuery,
  useLoginMutation,
  useRegisterMutation,
  useLazyLogoutQuery,
} = authAPI
