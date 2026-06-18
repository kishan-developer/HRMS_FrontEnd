import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: createBaseQuery('/api/v1/attendance'),
  tagTypes: ['Attendance', 'LeaveBalance', 'Regularization', 'AttendanceMachine'],
  endpoints: (builder) => ({
    getTodayAttendance: builder.query({
      query: () => '/my-today',
      providesTags: ['Attendance'],
    }),
    getAttendanceByRange: builder.query({
      query: ({ startDate, endDate }) => `/my-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Attendance'],
    }),
    getAttendanceStats: builder.query({
      query: ({ month, year }) => `/my-stats?month=${month}&year=${year}`,
      providesTags: ['Attendance'],
    }),
    getLeaveBalance: builder.query({
      query: (year) => `/leave-balance?year=${year}`,
      providesTags: ['LeaveBalance'],
    }),
    getMonthlyCalendar: builder.query({
      query: ({ month, year }) => `/calendar?month=${month}&year=${year}`,
      providesTags: ['Attendance'],
    }),
    getAttendanceSummary: builder.query({
      query: () => '/summary',
      providesTags: ['Attendance'],
    }),
    checkIn: builder.mutation({
      query: (data) => ({
        url: '/check-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    checkOut: builder.mutation({
      query: (data) => ({
        url: '/check-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    startBreak: builder.mutation({
      query: () => ({
        url: '/break/start',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
    endBreak: builder.mutation({
      query: () => ({
        url: '/break/end',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
    // Regularization endpoints
    getRegularizationRequests: builder.query({
      query: () => '/regularization',
      providesTags: ['Regularization'],
    }),
    createRegularizationRequest: builder.mutation({
      query: (data) => ({
        url: '/regularization',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Regularization'],
    }),
    updateRegularizationRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/regularization/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Regularization'],
    }),
    // New endpoints for attendance dashboard
    getHourlyPunchDistribution: builder.query({
      query: (date) => `/hourly-punch${date ? `?date=${date}` : ''}`,
      providesTags: ['Attendance'],
    }),
    getDepartmentAttendance: builder.query({
      query: (date) => `/department-breakdown${date ? `?date=${date}` : ''}`,
      providesTags: ['Attendance'],
    }),
    getRecentActivities: builder.query({
      query: (limit = 20) => `/recent-activities?limit=${limit}`,
      providesTags: ['Attendance'],
    }),
    getWeeklyTrend: builder.query({
      query: () => '/weekly-trend',
      providesTags: ['Attendance'],
    }),
    // Attendance Machine endpoints
    getAttendanceMachines: builder.query({
      query: () => '/machines',
      providesTags: ['AttendanceMachine'],
    }),
    getAttendanceMachineById: builder.query({
      query: (id) => `/machines/${id}`,
      providesTags: (result, error, id) => [{ type: 'AttendanceMachine', id }],
    }),
    addAttendanceMachine: builder.mutation({
      query: (data) => ({
        url: '/machines',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AttendanceMachine'],
    }),
    updateAttendanceMachine: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/machines/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AttendanceMachine', id }],
    }),
    deleteAttendanceMachine: builder.mutation({
      query: (id) => ({
        url: `/machines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AttendanceMachine'],
    }),
    syncAttendanceMachine: builder.mutation({
      query: (id) => ({
        url: `/machines/${id}/sync`,
        method: 'POST',
      }),
      invalidatesTags: ['Attendance', 'AttendanceMachine'],
    }),
    testMachineConnection: builder.mutation({
      query: (data) => ({
        url: '/machines/test-connection',
        method: 'POST',
        body: data,
      }),
    }),
    getSyncLogs: builder.query({
      query: (machineId) => `/machines/${machineId}/sync-logs`,
      providesTags: ['AttendanceMachine'],
    }),
    // HR Manager endpoints
    getAllEmployeesAttendance: builder.query({
      query: (date) => `/all-employees${date ? `?date=${date}` : ''}`,
      providesTags: ['Attendance'],
    }),
    getEmployeeTwoMonthAttendance: builder.query({
      query: (employeeId) => `/employee/${employeeId}/two-months`,
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetTodayAttendanceQuery,
  useGetAttendanceByRangeQuery,
  useGetAttendanceStatsQuery,
  useGetLeaveBalanceQuery,
  useGetMonthlyCalendarQuery,
  useGetAttendanceSummaryQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useStartBreakMutation,
  useEndBreakMutation,
  useGetRegularizationRequestsQuery,
  useCreateRegularizationRequestMutation,
  useUpdateRegularizationRequestMutation,
  useGetHourlyPunchDistributionQuery,
  useGetDepartmentAttendanceQuery,
  useGetRecentActivitiesQuery,
  useGetWeeklyTrendQuery,
  useGetAttendanceMachinesQuery,
  useGetAttendanceMachineByIdQuery,
  useAddAttendanceMachineMutation,
  useUpdateAttendanceMachineMutation,
  useDeleteAttendanceMachineMutation,
  useGetEmployeeTwoMonthAttendanceQuery,
  useSyncAttendanceMachineMutation,
  useTestMachineConnectionMutation,
  useGetSyncLogsQuery,
  useGetAllEmployeesAttendanceQuery,
} = attendanceApi;
