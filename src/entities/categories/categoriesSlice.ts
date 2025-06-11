import { createSlice } from '@reduxjs/toolkit';
import { categoriesAPI } from './categoriesAPI';
import { type Category } from './categories.type';

const initialState: {
  categories: Category[];
  loading: boolean;
  error: any;
} = {
  categories: [],
  loading: false,
  error: null,
};

export const categoriesSlice = createSlice({
  name: 'categoriesSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(categoriesAPI.endpoints.getCategories.matchPending, state => {
      state.categories = [];
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(categoriesAPI.endpoints.getCategories.matchFulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addMatcher(categoriesAPI.endpoints.getCategories.matchRejected, (state, action) => {
      state.loading = false;
      state.error = 'An error occurred.';
    });
  },
});

export const getCategories = (state: any) => (state.categoriesSlice as typeof initialState).categories;
export const { reducer } = categoriesSlice;
