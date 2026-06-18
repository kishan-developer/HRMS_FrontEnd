import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const performanceApi = createApi({
  reducerPath: 'performanceApi',
  baseQuery: createBaseQuery('/api/v1/performance'),
  tagTypes: ['Performance', 'KPI', 'Feedback'],
  endpoints: (builder) => ({
    // Reviews endpoints
    getReviews: builder.query({
      query: () => '/',
      providesTags: ['Performance'],
    }),
    getReviewById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Performance', id }],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Performance'],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Performance', id }],
    }),
    // KPIs endpoints
    getKPIs: builder.query({
      query: () => '/kpis',
      providesTags: ['KPI'],
    }),
    getKPIById: builder.query({
      query: (id) => `/kpis/${id}`,
      providesTags: (result, error, id) => [{ type: 'KPI', id }],
    }),
    createKPI: builder.mutation({
      query: (data) => ({
        url: '/kpis',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['KPI'],
    }),
    updateKPI: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/kpis/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'KPI', id }],
    }),
    deleteKPI: builder.mutation({
      query: (id) => ({
        url: `/kpis/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KPI'],
    }),
    // Feedback endpoints
    getFeedback: builder.query({
      query: () => '/feedback',
      providesTags: ['Feedback'],
    }),
    getFeedbackById: builder.query({
      query: (id) => `/feedback/${id}`,
      providesTags: (result, error, id) => [{ type: 'Feedback', id }],
    }),
    createFeedback: builder.mutation({
      query: (data) => ({
        url: '/feedback',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Feedback'],
    }),
    updateFeedback: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/feedback/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Feedback', id }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useGetKPIsQuery,
  useGetKPIByIdQuery,
  useCreateKPIMutation,
  useUpdateKPIMutation,
  useDeleteKPIMutation,
  useGetFeedbackQuery,
  useGetFeedbackByIdQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
} = performanceApi;
