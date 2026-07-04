'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, Clock, Ticket, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { dashboardApi, type SuperAdminSummary } from '@/services/dashboardApi';
import { StatsCardSkeleton } from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

export default function SuperAdminDashboard() {
  const [summary, setSummary] = useState<SuperAdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getSuperAdminSummary();
      if (res.success) setSummary(res.data);
      else setError('Failed to load dashboard data');
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const s = summary;

  const widgets = [
    { title: 'Total Companies', value: s?.totalCompanies ?? 0, icon: Building2, color: 'bg-blue-500', trend: `${s?.activeCompanies ?? 0} active` },
    { title: 'Total Employees', value: (s?.totalEmployees ?? 0).toLocaleString(), icon: Users, color: 'bg-green-500', trend: 'All employees' },
    { title: 'Present Today', value: (s?.presentToday ?? 0).toLocaleString(), icon: UserCheck, color: 'bg-emerald-500', trend: `${s?.absentToday ?? 0} absent` },
    { title: 'Pending Leaves', value: s?.pendingLeaves ?? 0, icon: Clock, color: 'bg-orange-500', trend: 'Awaiting approval' },
    { title: 'Support Tickets', value: s?.openSupportTickets ?? 0, icon: Ticket, color: 'bg-red-500', trend: 'Open tickets' },
    { title: 'System Health', value: 'Healthy', icon: Activity, color: 'bg-teal-500', trend: 'All systems operational' },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        <StatsCardSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return <div className="p-8"><ErrorState message={error} onRetry={fetchStats} /></div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Super Admin Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Platform overview with full control over companies, users, and system configuration
        </p>
      </div>

      {/* Key Widgets */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <StatCard key={widget.title} {...widget} />
          ))}
        </div>
      </section>

      {/* Subscription Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Company Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{s?.activeCompanies ?? 0}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Active</p>
            </div>
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{s?.trialCompanies ?? 0}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Trial</p>
            </div>
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{s?.expiredCompanies ?? 0}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Expired</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Attention Needed
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Pending Leaves</span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{s?.pendingLeaves ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Open Tickets</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">{s?.openSupportTickets ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Absent Today</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{s?.absentToday ?? 0}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {s?.recentActivities && s.recentActivities.length > 0 && (
        <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {s.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm text-zinc-900 dark:text-zinc-50">{activity.description}</p>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: { title: string; value: string | number; icon: any; color: string; trend: string }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{value}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{trend}</p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
