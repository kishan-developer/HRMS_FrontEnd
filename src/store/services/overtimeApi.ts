import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const overtimeApi = createApi({
  reducerPath: 'overtimeApi',
  baseQuery: createBaseQuery('/api/v1/overtime'),
  tagTypes: ['Overtime'],
  endpoints: (builder) => ({
    getOvertimeRequests: builder.query({
      query: () => '/',
      providesTags: ['Overtime'],
    }),
    getOvertimeById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Overtime', id }],
    }),
    createOvertimeRequest: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Overtime'],
    }),
    updateOvertimeRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Overtime', id }],
    }),
    deleteOvertimeRequest: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Overtime'],
    }),
  }),
});

export const {
  useGetOvertimeRequestsQuery,
  useGetOvertimeByIdQuery,
  useCreateOvertimeRequestMutation,
  useUpdateOvertimeRequestMutation,
  useDeleteOvertimeRequestMutation,
} = overtimeApi;
