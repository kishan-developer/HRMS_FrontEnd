'use client';

import { useGetKPIsQuery, useCreateKPIMutation, useUpdateKPIMutation, useDeleteKPIMutation } from '@/store/services/performanceApi';

export default function Page() {
  const { data: kpisData, isLoading, refetch } = useGetKPIsQuery({});
  const [createKPI] = useCreateKPIMutation();
  const [updateKPI] = useUpdateKPIMutation();
  const [deleteKPI] = useDeleteKPIMutation();

  const kpis = kpisData?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        Goals
      </h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
        {isLoading ? (
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        ) : kpis.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No goals found.</p>
        ) : (
          <div className="space-y-4">
            {kpis.map((kpi: any) => (
              <div key={kpi._id} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <p className="text-zinc-900 dark:text-zinc-50">KPI: {kpi.title || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Target: {kpi.target || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Current: {kpi.currentValue || 'N/A'}</p>
                <p className="text-zinc-600 dark:text-zinc-400">Status: {kpi.status || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
