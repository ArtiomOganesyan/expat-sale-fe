import TAG_TYPES from '../../store/constants/TagTypes';
import { listingApi } from './api';
import { type ItemFilter, type Item } from './items.type';

export const itemsAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getListingMasonry: builder.query<Item[], ItemFilter>({
      query: ({
        offset,
        limit,
        categoryId,
        title,
        isFree,
        isNew,
        minPrice,
        maxPrice,
        country,
        region,
        city,
        radius,
        userId,
      }: ItemFilter) => {
        const params = new URLSearchParams();

        if (offset !== undefined) params.set('offset', `${offset}`);
        if (limit !== undefined) params.set('limit', `${limit}`);
        if (categoryId) params.set('categoryId', categoryId);
        if (isFree) params.set('isFree', `${isFree ? 'true' : 'false'}`);
        if (isNew) params.set('isNew', `${isNew ? 'true' : 'false'}`);
        if (title && title.length > 3) params.set('title', title);
        if (minPrice) params.set('minPrice', `${minPrice}`);
        if (maxPrice) params.set('maxPrice', `${maxPrice}`);
        if (country) params.set('country', country);
        if (region) params.set('region', region);
        if (city) params.set('city', city);
        if (radius) params.set('radius', `${radius}`);
        if (userId) params.set('userId', userId);

        return `/items?${params.toString()}`;
      },
      providesTags: (
        _result,
        _error,
        { offset, limit, categoryId, title, isFree, isNew, minPrice, maxPrice, country, region, city, radius, userId }
      ) => {
        return [
          {
            type: TAG_TYPES.LISTING_MASONRY,
            id: `${limit}-${offset}-${categoryId}-${isFree}-${title}-${isNew}-${minPrice}-${maxPrice}-${country}-${region}-${city}-${radius}-${userId}`,
          },
        ];
      },
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
    getMaxPrice: builder.query<{ maxPrice: number }, string>({
      query: categoryId => `/items/max-price/${categoryId}`,
      providesTags: (_result, _error, categoryId) => [{ type: TAG_TYPES.LISTING_MASONRY, id: `max-price-${categoryId}` }],
    }),
  }),
});

export const { useGetListingMasonryQuery, useGetItemsByUserIdQuery, useGetMaxPriceQuery } = itemsAPI;
