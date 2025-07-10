import { listingApi } from './api';
import { type EditItem, type Item } from './items.type';

export const itemAPI = listingApi.injectEndpoints({
  endpoints: builder => ({
    getItemById: builder.query<Item, any>({
      query: ({ itemId }) => {
        return `/items/${itemId}`;
      },
    }),
    createItem: builder.mutation<any, any>({
      query: body => ({
        url: `/items`,
        method: 'POST',
        body: body,
        credentials: 'include',
      }),
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
    updateItem: builder.mutation<EditItem, { id: string; data: Partial<EditItem> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useCreateItemMutation, useAddImageToItemMutation, useUpdateItemMutation, useGetItemByIdQuery } = itemAPI;
