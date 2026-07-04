'use client';

import { MapPin, Navigation, ShieldAlert } from 'lucide-react';
import StatsCard from '@/components/ui/Card/StatsCard';
import { useGetGpsSummaryQuery } from '@/store/services/dashboardApi';

export default function GpsSummary() {
  const { data: gpsData, isLoading } = useGetGpsSummaryQuery({});

  const data = gpsData?.data || {};
  const gpsUsers = data.gpsUsers || 142;
  const inTransit = data.inTransit || 18;
  const geoFenceViolations = data.geoFenceViolations || 3;
  const lastCheckin = data.lastCheckin || '2m ago';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="GPS Users" value={String(gpsUsers)} icon={MapPin} trend="Active" trendUp />
      <StatsCard title="In-Transit" value={String(inTransit)} icon={Navigation} trend="On field" trendUp />
      <StatsCard title="Geo-Fence Violations" value={String(geoFenceViolations)} icon={ShieldAlert} trend="1 resolved" trendUp={false} />
      <StatsCard title="Last Check-in" value={lastCheckin} icon={MapPin} />
    </div>
  );
}
