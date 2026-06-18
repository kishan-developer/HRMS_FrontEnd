'use client';

import { useGetRegularizationRequestsQuery, useCreateRegularizationRequestMutation, useUpdateRegularizationRequestMutation } from '@/store/services/attendanceApi';

export default function Page() {
  const { data: regularizationData, isLoading, refetch } = useGetRegularizationRequestsQuery({});
  const [createRequest] = useCreateRegularizationRequestMutation();
  const [updateRequest] = useUpdateRegularizationRequestMutation();

  const requests = regularizationData?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Regularization Requests
      </h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        {isLoading ? (
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No regularization requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request: any) => (
              <div key={request._id} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-zinc-900 dark:text-zinc-50">Request: {request.reason || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Status: {request.status || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
