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
  }),
});

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: createBaseQuery('/api/v1/employees'),
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params?: { departmentId?: string; roleId?: string; shiftId?: string; status?: string; workType?: string; search?: string }) => {
        const sp = new URLSearchParams();
        if (params?.departmentId) sp.set('departmentId', params.departmentId);
        if (params?.roleId) sp.set('roleId', params.roleId);
        if (params?.shiftId) sp.set('shiftId', params.shiftId);
        if (params?.status) sp.set('status', params.status);
        if (params?.workType) sp.set('workType', params.workType);
        if (params?.search) sp.set('search', params.search);
        const qs = sp.toString();
        return qs ? `/?${qs}` : '/';
      },
      providesTags: ['Employee'],
    }),
    getEmployeeById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),
    getEmployeeByEmployeeId: builder.query({
      query: (employeeId) => `/employee-id/${employeeId}`,
      providesTags: (result, error, employeeId) => [{ type: 'Employee', id: employeeId }],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
    getDepartmentEmployees: builder.query({
      query: (departmentId) => `/department/${departmentId}`,
      providesTags: ['Employee'],
    }),
    getShiftEmployees: builder.query({
      query: (shiftId) => `/shift/${shiftId}`,
      providesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserProfileMutation,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = userApi;

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useGetEmployeeByEmployeeIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentEmployeesQuery,
  useGetShiftEmployeesQuery,
} = employeeApi;
