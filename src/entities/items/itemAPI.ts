import TAG_TYPES from '../../store/constants/TagTypes';
import { listingApi } from './api';
import { type EditItem, type Item } from './types/items';

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
} = itemAPI;
