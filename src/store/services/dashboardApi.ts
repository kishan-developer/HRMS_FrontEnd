import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: createBaseQuery('/api/v1/dashboard'),
  tagTypes: ['Dashboard', 'GPS', 'Alert', 'Department'],
  endpoints: (builder) => ({
    // GPS Summary endpoints
    getGpsSummary: builder.query({
      query: () => '/gps-summary',
      providesTags: ['GPS'],
    }),
    // Leave Summary endpoints
    getLeaveSummary: builder.query({
      query: () => '/leave-summary',
      providesTags: ['Dashboard'],
    }),
    getUpcomingHolidays: builder.query({
      query: () => '/holidays',
      providesTags: ['Dashboard'],
    }),
    // Payroll Summary endpoints
    getPayrollSummary: builder.query({
      query: (month) => `/payroll-summary${month ? `?month=${month}` : ''}`,
      providesTags: ['Dashboard'],
    }),
    // Alerts endpoints
    getAlerts: builder.query({
      query: () => '/alerts',
      providesTags: ['Alert'],
    }),
    resolveAlert: builder.mutation({
      query: (id) => ({
        url: `/alerts/${id}/resolve`,
        method: 'POST',
      }),
      invalidatesTags: ['Alert'],
    }),
    // Department Insights endpoints
    getDepartmentInsights: builder.query({
      query: () => '/department-insights',
      providesTags: ['Department'],
    }),
    // Department-wise attendance with location filter
    getDepartmentAttendanceByLocation: builder.query({
      query: (location) => `/department-attendance${location ? `?location=${location}` : ''}`,
      providesTags: ['Department'],
    }),
  }),
});

export const {
  useGetGpsSummaryQuery,
  useGetLeaveSummaryQuery,
  useGetUpcomingHolidaysQuery,
  useGetPayrollSummaryQuery,
  useGetAlertsQuery,
  useResolveAlertMutation,
  useGetDepartmentInsightsQuery,
  useGetDepartmentAttendanceByLocationQuery,
} = dashboardApi;
