import TAG_TYPES from '../../store/constants/TagTypes';
import { placesApi } from './api';
import type { City, Country, Region } from './places.type';

export const placesForItemsAPI = placesApi.injectEndpoints({
  endpoints: builder => ({
    getCountries: builder.query<Country[], any>({
      query: ({ query }) => `/places/countries?search=${query}`,
      providesTags: (_result, _error, { query }) => [{ type: TAG_TYPES.COUNTRIES_FOR_ITEM }],
    }),
    getRegions: builder.query<Region[], any>({
      query: ({ query }) => `/places/regions?search=${query}`,
      providesTags: (_result, _error, { query }) => [{ type: TAG_TYPES.REGIONS_FOR_ITEM }],
    }),

    getCities: builder.query<City[], any>({
      query: ({ query }) => `/places/cities?search=${query}`,
      providesTags: (_result, _error, { query }) => [{ type: TAG_TYPES.CITIES_FOR_ITEM }],
    }),
  }),
});

export const { useGetCountriesQuery, useGetRegionsQuery, useGetCitiesQuery } = placesForItemsAPI;
