import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: createBaseQuery('/api/v1/companies'),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    getCompanyById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    getCompanies: builder.query({
      query: () => '/',
      providesTags: ['Company'],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }],
    }),
    createCompany: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    getCompanySettings: builder.query({
      query: (id) => `/${id}/settings`,
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    updateCompanySettings: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/settings`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }],
    }),
  }),
});

export const {
  useGetCompanyByIdQuery,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
} = companyApi;
