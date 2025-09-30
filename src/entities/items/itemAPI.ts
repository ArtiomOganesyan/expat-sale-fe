import TAG_TYPES from '../../store/constants/TagTypes';
import { listingApi } from './api';
import { type EditItem, type Item } from './types/items';

const resolveLangForTemplate = () => {
  try {
    const raw = localStorage.getItem('i18nextLng') || '';
    const base = raw.split('-')[0]?.toLowerCase();
    const map: Record<string, string> = {
      en: 'en',
      ru: 'ru',
    };
    return map[base] || 'en';
  } catch {
    return 'en';
  }
};

export const itemAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getItemById: builder.query<Item, any>({
      query: ({ itemId }) => {
        return `/items/${itemId}`;
      },
      providesTags: (result, error, { itemId }) => [{ type: TAG_TYPES.ITEM_BY_ID, id: itemId }],
    }),
    createItem: builder.mutation<any, any>({
      query: body => ({
        url: `/items`,
        method: 'POST',
        body: body,
        credentials: 'include',
      }),
      invalidatesTags: (result, error) => [{ type: TAG_TYPES.LISTING_MASONRY, id: `items-user-stat` }],
    }),
    addImageToItem: builder.mutation<any, any>({
      query: ({ itemId, files }) => {
        const formData = new FormData();
        files.forEach((file: File) => {
          formData.append('files', file);
        });

        return {
          url: `/media/item/${itemId}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    updateImageToItem: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/media/item/${id}`,
        headers: {},
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
    }),
    deleteImageInItem: builder.mutation<any, any>({
      query: ({ imageId }) => {
        return {
          url: `/media/item/${imageId}`,
          method: 'DELETE',
        };
      },
    }),
    updateItem: builder.mutation<EditItem, { id: string; data: Partial<EditItem> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TAG_TYPES.ITEM_BY_ID, id },
        { type: TAG_TYPES.LISTING_MASONRY, id: `items-user-stat` },
      ],
    }),

    addToFavorite: builder.mutation<void, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `/items/favorite/${itemId}`,
        method: 'POST',
      }),
    }),
    removeFromFavorite: builder.mutation<void, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `/items/favorite/${itemId}`,
        method: 'DELETE',
      }),
    }),
    getPriceListTemplate: builder.query<string, void>({
      query: () => {
        const lang = resolveLangForTemplate();
        return {
          url: `/media/price-list/template/${lang}`,
          method: 'GET',
          headers: { Accept: 'text/csv' },
          responseHandler: 'text' as const,
        };
      },
      keepUnusedDataFor: 0,
    }),
    uploadPriceList: builder.mutation<void, { itemId: string; file: File }>({
      query: ({ itemId, file }) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return {
          url: `/media/price-list/service/${itemId}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (r, e, { itemId }) => [
        { type: TAG_TYPES.ITEM_BY_ID, id: itemId },
        { type: TAG_TYPES.LISTING_MASONRY, id: `items-user-stat` },
      ],
    }),
    getPriceListByItem: builder.query<string, { itemId: string }>({
      query: ({ itemId }) => ({
        url: `/media/price-list/service/${itemId}`,
        method: 'GET',
        headers: { Accept: 'text/csv' },
        responseHandler: 'text' as const, 
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useCreateItemMutation,
  useAddImageToItemMutation,
  useUpdateImageToItemMutation,
  useUpdateItemMutation,
  useDeleteImageInItemMutation,
  useGetItemByIdQuery,
  useAddToFavoriteMutation,
  useRemoveFromFavoriteMutation,
  useLazyGetPriceListTemplateQuery,
  useUploadPriceListMutation,
  useLazyGetPriceListByItemQuery,
} = itemAPI;
