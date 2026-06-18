'use client';

import { useGetReviewsQuery, useGetKPIsQuery, useGetFeedbackQuery } from '@/store/services/performanceApi';

export default function Page() {
  const { data: reviewsData } = useGetReviewsQuery({});
  const { data: kpisData } = useGetKPIsQuery({});
  const { data: feedbackData } = useGetFeedbackQuery({});

  const reviews = reviewsData?.data || [];
  const kpis = kpisData?.data || [];
  const feedback = feedbackData?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Performance Reports
      </h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{reviews.length}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Reviews</p>
              </div>
              <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{kpis.length}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Active KPIs</p>
              </div>
              <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{feedback.length}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
