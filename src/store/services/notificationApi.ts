import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: createBaseQuery('/api/v1/notifications'),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: ({ unreadOnly, page, pageSize }) => `/my-notifications?unreadOnly=${unreadOnly}&page=${page}&pageSize=${pageSize}`,
      providesTags: ['Notification'],
    }),
    getNotificationById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/mark-all-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
