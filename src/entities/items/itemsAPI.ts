import TAG_TYPES from '../../store/constants/TagTypes';
import { listingApi } from './api';
import { type Item } from './items.type';

export const itemsAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getListingMasonry: builder.query<
      Item[],
      {
        offset?: number | undefined;
        limit?: number | undefined;
        categoryId?: string | null;
        isFree?: string | null;
        title?: string | null;
      }
    >({
      query: ({ offset, limit, categoryId, isFree, title }) => {
        const params = new URLSearchParams();

        if (offset !== undefined) params.set('offset', `${offset}`);
        if (limit !== undefined) params.set('limit', `${limit}`);
        if (categoryId) params.set('categoryId', categoryId);
        if (isFree) params.set('is_free', isFree);
        if (title && title.length > 3) params.set('title', title);

        return `/items?${params.toString()}`;
      },
      providesTags: (_result, _error, { offset, limit, categoryId, isFree, title }) => [
        { type: TAG_TYPES.LISTING_MASONRY, id: `${limit}-${offset}-${categoryId}-${isFree}-${title}` },
      ],
    }),
    getItemsByUserId: builder.query<any, any>({
      query: ({ user_id }) => `/users/${user_id}/items`,
      providesTags: (_result, _error, { user_id }) => [{ type: TAG_TYPES.LISTING_MASONRY, id: `items-user-${user_id}` }],
    }),
    checkStoreNameUniqueness: builder.query<any, any>({
      query: body => ({
        url: `/stores/check-unique-names`,
        method: 'POST',
        body,
      }),
    }),
    CheckExternalIdUniqueness: builder.query<any, any>({
      query: body => ({
        url: `/stores/check-unique-external-id`,
        method: 'POST',
        body,
      }),
    }),
    searchStoreAddress: builder.query<any, any>({
      query: query => ({
        url: `/stores/addresses?address=${query.address}&country=${query.country}`,
        method: 'GET',
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createStore: builder.mutation<any, FormData>({
      query: body => ({
        url: '/stores',
        method: 'POST',
        body,
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editStore: builder.mutation({
      query: ({ storeId, body }) => ({
        url: `/stores/${storeId}`,
        method: 'PUT',
        body,
      }),
      //   invalidatesTags: ["Store", "StoreList"],
    }),
  }),
});

export const { useGetListingMasonryQuery, useGetItemsByUserIdQuery } = itemsAPI;
