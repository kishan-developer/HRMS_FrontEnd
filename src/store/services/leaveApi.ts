import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const leaveApi = createApi({
  reducerPath: 'leaveApi',
  baseQuery: createBaseQuery('/api/v1/leaves'),
  tagTypes: ['Leave', 'LeaveBalance', 'Holiday', 'LeaveType'],
  endpoints: (builder) => ({
    getMyLeaveRequests: builder.query({
      query: () => '/my-requests',
      providesTags: ['Leave'],
    }),
    getMyPendingLeaves: builder.query({
      query: () => '/my-pending',
      providesTags: ['Leave'],
    }),
    getLeaveById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Leave', id }],
    }),
    createLeave: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leave', 'LeaveBalance'],
    }),
    updateLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Leave', id }],
    }),
    cancelLeave: builder.mutation({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Leave'],
    }),
    getLeaveBalance: builder.query({
      query: (employeeId) => `/balance/${employeeId}`,
      providesTags: ['LeaveBalance'],
    }),
    getPendingLeaves: builder.query({
      query: () => '/pending',
      providesTags: ['Leave'],
    }),
    // Holidays endpoints
    getHolidays: builder.query({
      query: () => '/holidays',
      providesTags: ['Holiday'],
    }),
    createHoliday: builder.mutation({
      query: (data) => ({
        url: '/holidays',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Holiday'],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/holidays/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Holiday'],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `/holidays/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Holiday'],
    }),
    // Leave types endpoints
    getLeaveTypes: builder.query({
      query: () => '/types',
      providesTags: ['LeaveType'],
    }),
    createLeaveType: builder.mutation({
      query: (data) => ({
        url: '/types',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LeaveType'],
    }),
    updateLeaveType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/types/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['LeaveType'],
    }),
    deleteLeaveType: builder.mutation({
      query: (id) => ({
        url: `/types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LeaveType'],
    }),
  }),
});

export const {
  useGetMyLeaveRequestsQuery,
  useGetMyPendingLeavesQuery,
  useGetLeaveByIdQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useCancelLeaveMutation,
  useGetLeaveBalanceQuery,
  useGetPendingLeavesQuery,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} = leaveApi;
