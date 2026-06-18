import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const offboardingApi = createApi({
  reducerPath: 'offboardingApi',
  baseQuery: createBaseQuery('/api/v1/offboarding'),
  tagTypes: ['Offboarding'],
  endpoints: (builder) => ({
    getOffboardingRecords: builder.query({
      query: () => '/',
      providesTags: ['Offboarding'],
    }),
    getOffboardingById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Offboarding', id }],
    }),
    createOffboarding: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Offboarding'],
    }),
    updateOffboarding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Offboarding', id }],
    }),
  }),
});

export const {
  useGetOffboardingRecordsQuery,
  useGetOffboardingByIdQuery,
  useCreateOffboardingMutation,
  useUpdateOffboardingMutation,
} = offboardingApi;
