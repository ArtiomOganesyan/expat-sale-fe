import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    authCheck: builder.query<any, any>({
      query: () => ({
        url: `auth`,
        method: "GET",
        credentials: "include",
      }),
    }),
    login: builder.mutation<any, { username: string; password: string }>({
      query: ({ username, password }) => ({
        url: `auth/login`,
        method: "POST",
        body: { username, password },
        credentials: "include",
      }),
    }),
    register: builder.mutation<any, any>({
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
