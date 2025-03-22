import { listingApi } from "./api"

export const itemAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getItemById: builder.query<any, any>({
      query: ({ skip, limit, category, isFree }) => {
        const params = new URLSearchParams()

        if (skip !== undefined) params.set("skip", skip)
        if (limit !== undefined) params.set("limit", limit)
        if (category) params.set("category", category)
        if (isFree) params.set("is_free", isFree)

        return `/items?${params.toString()}`
      },
    }),
    createItem: builder.mutation<any, any>({
      query: body => ({
        url: `/items`,
        method: "POST",
        body: body,
        credentials: "include",
      }),
    }),
  }),
})

export const { useCreateItemMutation } = itemAPI
