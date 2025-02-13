import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    updateUser: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
})

export const { useUpdateUserMutation } = userAPI
