import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const shiftsApi = createApi({
  reducerPath: 'shiftsApi',
  baseQuery: createBaseQuery('/api/v1/shifts'),
  tagTypes: ['Shift'],
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: () => '/',
      providesTags: ['Shift'],
    }),
    getShiftById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shift', id }],
    }),
    createShift: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Shift'],
    }),
    updateShift: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Shift', id }],
    }),
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shift'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftByIdQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftsApi;
