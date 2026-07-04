'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Ticket, CheckCircle, Clock, AlertCircle, Activity, TrendingUp } from 'lucide-react';
import { dashboardApi, type SupportSummary } from '@/services/dashboardApi';
import { StatsCardSkeleton } from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import StatusBadge from '@/components/ui/StatusBadge';

export default function SupportDashboard() {
  const { userId } = useParams();
  const [summary, setSummary] = useState<SupportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getSupportSummary();
      if (res.success) setSummary(res.data);
      else setError('Failed to load dashboard data');
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const s = summary;

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        <StatsCardSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return <div className="p-8"><ErrorState message={error} onRetry={fetchSummary} /></div>;
  }

  const stats = [
    { label: 'Total Tickets', value: s?.totalTickets ?? 0, icon: Ticket, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Open', value: s?.openTickets ?? 0, icon: Activity, color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' },
    { label: 'In Progress', value: s?.inProgressTickets ?? 0, icon: Clock, color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' },
    { label: 'Resolved', value: s?.resolvedTickets ?? 0, icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
    { label: 'Urgent', value: s?.urgentTickets ?? 0, icon: AlertCircle, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
    { label: 'SLA Pending', value: s?.slaPendingTickets ?? 0, icon: TrendingUp, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Support Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage and resolve employee support tickets</p>
        </div>
        <Link
          href="/dashboard/support/tickets"
          className="px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors text-sm font-medium"
        >
          View All Tickets
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, textColor }) => (
          <div key={label} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
              </div>
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {s?.recentTickets && s.recentTickets.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Tickets</h3>
            <Link href="/dashboard/support/tickets" className="text-sm text-[#94cb3d] hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {s.recentTickets.map((ticket) => (
              <div key={ticket._id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{ticket.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
