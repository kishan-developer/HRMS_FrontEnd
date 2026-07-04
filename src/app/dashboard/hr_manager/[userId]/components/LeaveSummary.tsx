'use client';

import { CalendarDays, Clock, Sun, Users } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import { useGetLeaveSummaryQuery, useGetUpcomingHolidaysQuery } from '@/store/services/dashboardApi';

const leaveStatsConfig = [
  { 
    label: 'Applied Today', 
    key: 'appliedToday' as const,
    icon: CalendarDays, 
    color: 'text-blue-600' 
  },
  { 
    label: 'Pending Approvals', 
    key: 'pendingApprovals' as const,
    icon: Clock, 
    color: 'text-amber-600' 
  },
  { 
    label: 'On Leave Today', 
    key: 'onLeaveToday' as const,
    icon: Sun, 
    color: 'text-purple-600' 
  },
  { 
    label: 'Team Available', 
    key: 'teamAvailable' as const,
    icon: Users, 
    color: 'text-green-600' 
  },
];

export default function LeaveSummary() {
  const { data: leaveData, isLoading: leaveLoading } = useGetLeaveSummaryQuery({});
  const { data: holidaysData, isLoading: holidaysLoading } = useGetUpcomingHolidaysQuery({});

  const leaveStats = leaveData?.data || {};
  const holidays = Array.isArray(holidaysData?.data) ? holidaysData.data : [];

  const leaveStatsDisplay = leaveStatsConfig.map((config) => ({
    ...config,
    value: leaveStats[config.key] || (config.key === 'teamAvailable' ? '88%' : '0'),
  }));

  if (leaveLoading || holidaysLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse">
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded mb-2"></div>
              <div className="h-6 w-12 bg-zinc-200 dark:bg-zinc-700 rounded mb-1"></div>
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
        <Card className="p-4 animate-pulse">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {leaveStatsDisplay.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4"
          >
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card className="p-4">
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Upcoming Holidays</h4>
        <div className="space-y-3">
          {holidays.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No upcoming holidays</p>
          ) : (
            holidays.map((h: any) => (
              <div key={h._id || h.id || h.name} className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{h.name}</span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                  {h.date ? new Date(h.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }) : h.displayDate}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
