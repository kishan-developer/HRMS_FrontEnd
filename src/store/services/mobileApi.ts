import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const mobileApi = createApi({
  reducerPath: 'mobileApi',
  baseQuery: createBaseQuery('/api/v1/mobile'),
  tagTypes: ['MobileDevice', 'Location', 'OfflineSync', 'MobileDashboard'],
  endpoints: (builder) => ({
    // Push Notification APIs
    registerDevice: builder.mutation({
      query: (data) => ({
        url: '/register-device',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MobileDevice'],
    }),
    unregisterDevice: builder.mutation({
      query: (token) => ({
        url: '/unregister-device',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['MobileDevice'],
    }),
    sendPushNotification: builder.mutation({
      query: (data) => ({
        url: '/send-push',
        method: 'POST',
        body: data,
      }),
    }),
    getRegisteredDevices: builder.query({
      query: (userId) => `/devices/${userId}`,
      providesTags: ['MobileDevice'],
    }),

    // GPS Location APIs
    verifyLocation: builder.mutation({
      query: (data) => ({
        url: '/verify-location',
        method: 'POST',
        body: data,
      }),
    }),
    getAllowedLocations: builder.query({
      query: () => '/allowed-locations',
      providesTags: ['Location'],
    }),
    addAllowedLocation: builder.mutation({
      query: (data) => ({
        url: '/allowed-locations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Location'],
    }),
    removeAllowedLocation: builder.mutation({
      query: (id) => ({
        url: `/allowed-locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
    checkInWithLocation: builder.mutation({
      query: (data) => ({
        url: '/check-in-with-location',
        method: 'POST',
        body: data,
      }),
    }),
    checkOutWithLocation: builder.mutation({
      query: (data) => ({
        url: '/check-out-with-location',
        method: 'POST',
        body: data,
      }),
    }),

    // Offline Sync APIs
    getPendingActions: builder.query({
      query: (userId) => `/sync/pending-actions/${userId}`,
      providesTags: ['OfflineSync'],
    }),
    uploadOfflineData: builder.mutation({
      query: (data) => ({
        url: '/sync/upload-offline-data',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['OfflineSync'],
    }),
    getLastSyncTimestamp: builder.query({
      query: (userId) => `/sync/last-sync/${userId}`,
      providesTags: ['OfflineSync'],
    }),
    markSyncComplete: builder.mutation({
      query: (data) => ({
        url: '/sync/mark-complete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['OfflineSync'],
    }),
    getOfflineData: builder.query({
      query: (userId) => `/sync/offline-data/${userId}`,
      providesTags: ['OfflineSync'],
    }),

    // Mobile Dashboard APIs
    getEmployeeDashboard: builder.query({
      query: (userId) => `/dashboard/employee/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    getHRManagerDashboard: builder.query({
      query: (userId) => `/dashboard/hr-manager/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    getMobileStats: builder.query({
      query: (userId) => `/stats/${userId}`,
      providesTags: ['MobileDashboard'],
    }),

    // Mobile-Specific Attendance APIs
    getTodayStatus: builder.query({
      query: (userId) => `/attendance/today-status/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    getWeeklySummary: builder.query({
      query: (userId) => `/attendance/weekly-summary/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    getMonthlySummary: builder.query({
      query: ({ userId, month, year }) => `/attendance/monthly-summary/${userId}?month=${month}&year=${year}`,
      providesTags: ['MobileDashboard'],
    }),

    // Mobile-Specific Leave APIs
    getMyLeaveBalance: builder.query({
      query: (userId) => `/leave/balance/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    getUpcomingHolidays: builder.query({
      query: () => '/leave/upcoming-holidays',
      providesTags: ['MobileDashboard'],
    }),

    // Mobile-Specific Payslip APIs
    getRecentPayslips: builder.query({
      query: (userId) => `/payslips/recent/${userId}`,
      providesTags: ['MobileDashboard'],
    }),
    downloadPayslipPDF: builder.query({
      query: (id) => `/payslips/download/${id}`,
    }),
  }),
});

export const {
  useRegisterDeviceMutation,
  useUnregisterDeviceMutation,
  useSendPushNotificationMutation,
  useGetRegisteredDevicesQuery,
  useVerifyLocationMutation,
  useGetAllowedLocationsQuery,
  useAddAllowedLocationMutation,
  useRemoveAllowedLocationMutation,
  useCheckInWithLocationMutation,
  useCheckOutWithLocationMutation,
  useGetPendingActionsQuery,
  useUploadOfflineDataMutation,
  useGetLastSyncTimestampQuery,
  useMarkSyncCompleteMutation,
  useGetOfflineDataQuery,
  useGetEmployeeDashboardQuery,
  useGetHRManagerDashboardQuery,
  useGetMobileStatsQuery,
  useGetTodayStatusQuery,
  useGetWeeklySummaryQuery,
  useGetMonthlySummaryQuery,
  useGetMyLeaveBalanceQuery,
  useGetUpcomingHolidaysQuery,
  useGetRecentPayslipsQuery,
  useDownloadPayslipPDFQuery,
} = mobileApi;
