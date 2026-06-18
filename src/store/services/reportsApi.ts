import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: createBaseQuery('/api/v1/reports'),
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getAttendanceReport: builder.query({
      query: () => '/attendance',
      providesTags: ['Report'],
    }),
    getLeaveReport: builder.query({
      query: () => '/leave',
      providesTags: ['Report'],
    }),
    getPerformanceReport: builder.query({
      query: () => '/performance',
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetAttendanceReportQuery,
  useGetLeaveReportQuery,
  useGetPerformanceReportQuery,
} = reportsApi;
