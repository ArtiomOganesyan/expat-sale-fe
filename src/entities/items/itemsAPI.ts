import TAG_TYPES from "../../store/constants/TagTypes"
import { listingApi } from "./api"

export const itemsAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getListingMasonry: builder.query<any, any>({
      query: ({ offset, limit, categoryId, isFree }) => {
        const params = new URLSearchParams()

        if (offset !== undefined) params.set("offset", offset)
        if (limit !== undefined) params.set("limit", limit)
        if (categoryId) params.set("categoryId", categoryId)
        if (isFree) params.set("is_free", isFree)

        return `/items?${params.toString()}`
      },
      providesTags: (_result, _error, { offset, limit }) => [
        { type: TAG_TYPES.LISTING_MASONRY, id: `${limit}-${offset}` },
      ],
    }),
    getItemsByUserId: builder.query<any, any>({
      query: ({ user_id }) => `/items/user/${user_id}`,
      providesTags: (_result, _error, { user_id }) => [
        { type: TAG_TYPES.LISTING_MASONRY, id: `items-user-${user_id}` },
      ],
    }),
    checkStoreNameUniqueness: builder.query<any, any>({
      query: body => ({
        url: `/stores/check-unique-names`,
        method: "POST",
        body,
      }),
    }),
    CheckExternalIdUniqueness: builder.query<any, any>({
      query: body => ({
        url: `/stores/check-unique-external-id`,
        method: "POST",
        body,
      }),
    }),
    searchStoreAddress: builder.query<any, any>({
      query: query => ({
        url: `/stores/addresses?address=${query.address}&country=${query.country}`,
        method: "GET",
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createStore: builder.mutation<any, FormData>({
      query: body => ({
        url: "/stores",
        method: "POST",
        body,
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editStore: builder.mutation({
      query: ({ storeId, body }) => ({
        url: `/stores/${storeId}`,
        method: "PUT",
        body,
      }),
      //   invalidatesTags: ["Store", "StoreList"],
    }),
  }),
})

export const { useGetListingMasonryQuery, useGetItemsByUserIdQuery } = itemsAPI
