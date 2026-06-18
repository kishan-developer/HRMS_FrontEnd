import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: createBaseQuery('/api/v1/assets'),
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    getAssets: builder.query({
      query: () => '/',
      providesTags: ['Asset'],
    }),
    getAssetById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Asset', id }],
    }),
    createAsset: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Asset'],
    }),
    updateAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Asset', id }],
    }),
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Asset'],
    }),
    getInventory: builder.query({
      query: () => '/inventory/all',
      providesTags: ['Asset'],
    }),
    assignAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/assign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Asset'],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetInventoryQuery,
  useAssignAssetMutation,
} = assetsApi;
