import { ExpatSaleApi } from "../../app/api"
import TAG_TYPES from "../../app/constants/TagTypes"

export const listingAPI = ExpatSaleApi.injectEndpoints({
  endpoints: builder => ({
    getListingMasonry: builder.query<any, any>({
      query: ({ skip, limit, category, isFree }) => {
        const params = new URLSearchParams()

        if (skip !== undefined) params.set("skip", skip)
        if (limit !== undefined) params.set("limit", limit)
        if (category) params.set("category", category)
        if (isFree) params.set("is_free", isFree)

        return `/items?${params.toString()}`
      },
      providesTags: (_result, _error, { skip, limit }) => [
        { type: TAG_TYPES.LISTING_MASONRY, id: `${limit}-${skip}` },
      ],
    }),
    getStoreById: builder.query<any, any>({
      query: ({ id }) => `stores/${id}`,
      providesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.LISTING_CARD, id },
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

export const { useGetListingMasonryQuery } = listingAPI
