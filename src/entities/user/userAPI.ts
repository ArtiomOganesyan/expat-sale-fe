import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { type User } from "./user.type"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export const userAPI = createApi({
  reducerPath: "userAPI",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL, credentials: "include" }),
  endpoints: builder => ({
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
    }),
    updateUserAvatar: builder.mutation<
      any,
      { id: string; entity: "user" | "item"; formData: FormData }
    >({
      query: ({ entity, id, formData }) => ({
        url: `/media/${entity}/${id}`,
        headers: {},
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
})

export const { useUpdateUserMutation, useUpdateUserAvatarMutation } = userAPI
