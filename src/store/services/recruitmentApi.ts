import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const recruitmentApi = createApi({
  reducerPath: 'recruitmentApi',
  baseQuery: createBaseQuery('/api/v1/recruitment'),
  tagTypes: ['Job', 'Candidate', 'Interview'],
  endpoints: (builder) => ({
    // Jobs
    getJobs: builder.query({
      query: () => '/jobs',
      providesTags: ['Job'],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation({
      query: (data) => ({
        url: '/jobs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),

    // Candidates
    getCandidates: builder.query({
      query: () => '/candidates',
      providesTags: ['Candidate'],
    }),
    getCandidateById: builder.query({
      query: (id) => `/candidates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Candidate', id }],
    }),
    createCandidate: builder.mutation({
      query: (data) => ({
        url: '/candidates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Candidate'],
    }),
    updateCandidate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/candidates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Candidate', id }],
    }),
    deleteCandidate: builder.mutation({
      query: (id) => ({
        url: `/candidates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Candidate'],
    }),

    // Interviews
    getInterviews: builder.query({
      query: () => '/interviews',
      providesTags: ['Interview'],
    }),
    getInterviewById: builder.query({
      query: (id) => `/interviews/${id}`,
      providesTags: (result, error, id) => [{ type: 'Interview', id }],
    }),
    createInterview: builder.mutation({
      query: (data) => ({
        url: '/interviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Interview'],
    }),
    updateInterview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/interviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Interview', id }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetCandidatesQuery,
  useGetCandidateByIdQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  useCreateInterviewMutation,
  useUpdateInterviewMutation,
} = recruitmentApi;
