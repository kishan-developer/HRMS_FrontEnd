import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const leaveApi = createApi({
  reducerPath: 'leaveApi',
  baseQuery: createBaseQuery('/api/v1/leaves'),
  tagTypes: ['Leave', 'LeaveBalance', 'Holiday', 'LeaveType'],
  endpoints: (builder) => ({
    getAllLeaves: builder.query({
      query: (params?: { status?: string; employeeId?: string; leaveType?: string; page?: number; pageSize?: number }) => {
        const sp = new URLSearchParams();
        if (params?.status) sp.set('status', params.status);
        if (params?.employeeId) sp.set('employeeId', params.employeeId);
        if (params?.leaveType) sp.set('leaveType', params.leaveType);
        if (params?.page) sp.set('page', String(params.page));
        if (params?.pageSize) sp.set('pageSize', String(params.pageSize));
        const qs = sp.toString();
        return qs ? `/?${qs}` : '/';
      },
      providesTags: ['Leave'],
    }),
    getLeaveApprovals: builder.query({
      query: () => '/approvals',
      providesTags: ['Leave'],
    }),
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
    approveLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    rejectLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Leave'],
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
  useGetAllLeavesQuery,
  useGetLeaveApprovalsQuery,
  useGetMyLeaveRequestsQuery,
  useGetMyPendingLeavesQuery,
  useGetLeaveByIdQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useCancelLeaveMutation,
  useGetLeaveBalanceQuery,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} = leaveApi;
