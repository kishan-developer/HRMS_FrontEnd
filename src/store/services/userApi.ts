import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQuery('/api/v1/users'),
  tagTypes: ['User', 'Document', 'Employee'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/',
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    uploadDocument: builder.mutation({
      query: ({ id, file, category, isVerified }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('isVerified', isVerified);
        return {
          url: `/${id}/documents`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'Document', id }],
    }),
    deleteDocument: builder.mutation({
      query: ({ userId, documentId }) => ({
        url: `/${userId}/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'Document', id: userId }],
    }),
    // Employee-specific endpoints
    getEmployees: builder.query({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: '/employees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee', 'User'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, { type: 'User', id }],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee', 'User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserProfileMutation,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = userApi;
