'use client';

import { useGetReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation } from '@/store/services/performanceApi';

export default function Page() {
  const { data: reviewsData, isLoading, refetch } = useGetReviewsQuery({});
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const reviews = reviewsData?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Appraisal
      </h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        {isLoading ? (
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No appraisals found.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review._id} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-zinc-900 dark:text-zinc-50">Review: {review.title || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Status: {review.status || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Rating: {review.rating || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
