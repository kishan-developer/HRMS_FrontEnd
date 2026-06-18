import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: createBaseQuery('/api/v1/onboarding'),
  tagTypes: ['Onboarding'],
  endpoints: (builder) => ({
    getJoiningLinks: builder.query({
      query: () => '/joining-links',
      providesTags: ['Onboarding'],
    }),
    createJoiningLink: builder.mutation({
      query: (data) => ({
        url: '/joining-links',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Onboarding'],
    }),
    deactivateLink: builder.mutation({
      query: (id) => ({
        url: `/joining-links/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Onboarding'],
    }),
    resendEmail: builder.mutation({
      query: (id) => ({
        url: `/joining-links/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['Onboarding'],
    }),
  }),
});

export const {
  useGetJoiningLinksQuery,
  useCreateJoiningLinkMutation,
  useDeactivateLinkMutation,
  useResendEmailMutation,
} = onboardingApi;
