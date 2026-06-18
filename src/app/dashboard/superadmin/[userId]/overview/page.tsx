'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, DollarSign, Clock, Ticket, FileText, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalCompanies: number;
  totalEmployees: number;
  activeUsers: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  supportTickets: number;
  payrollProcessed: number;
  systemHealth: string;
  trialCompanies: number;
  activeCompanies: number;
  expiredCompanies: number;
}

export default function SuperAdminDashboard() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalEmployees: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
    pendingApprovals: 0,
    supportTickets: 0,
    payrollProcessed: 0,
    systemHealth: 'Healthy',
    trialCompanies: 0,
    activeCompanies: 0,
    expiredCompanies: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/super-admin/dashboard/stats`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        // Use mock data if API fails
        setStats({
          totalCompanies: 156,
          totalEmployees: 12450,
          activeUsers: 8234,
          monthlyRevenue: 285000,
          pendingApprovals: 23,
          supportTickets: 45,
          payrollProcessed: 12450,
          systemHealth: 'Healthy',
          trialCompanies: 12,
          activeCompanies: 138,
          expiredCompanies: 6,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const widgets = [
    { title: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'bg-blue-500', trend: '+5 this month' },
    { title: 'Total Employees', value: stats.totalEmployees.toLocaleString(), icon: Users, color: 'bg-green-500', trend: '+234 this month' },
    { title: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: UserCheck, color: 'bg-emerald-500', trend: '66% active' },
    { title: 'Monthly Revenue', value: `$${(stats.monthlyRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-purple-500', trend: '+12% vs last month' },
    { title: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'bg-orange-500', trend: 'Needs attention' },
    { title: 'Support Tickets', value: stats.supportTickets, icon: Ticket, color: 'bg-red-500', trend: '8 critical' },
    { title: 'Payroll Processed', value: stats.payrollProcessed.toLocaleString(), icon: FileText, color: 'bg-cyan-500', trend: 'This month' },
    { title: 'System Health', value: stats.systemHealth, icon: Activity, color: 'bg-teal-500', trend: 'All systems operational' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading dashboard...
        </div>
      </div>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            Subscription Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stats.activeCompanies}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Active Companies</p>
            </div>
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stats.trialCompanies}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Trial Companies</p>
            </div>
            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stats.expiredCompanies}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Expired</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Pending Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Company Approvals</span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">8</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Payment Issues</span>
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Critical Tickets</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Company Activity</h3>
        <div className="space-y-4">
          {[
            { company: 'TechCorp Inc.', action: 'Upgraded to Enterprise', time: '2 hours ago', status: 'success' },
            { company: 'StartupXYZ', action: 'Subscription expired', time: '5 hours ago', status: 'warning' },
            { company: 'Global Solutions', action: 'New company registered', time: '1 day ago', status: 'info' },
            { company: 'Innovate Ltd', action: 'Added 50 employees', time: '2 days ago', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{activity.company}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.action}</p>
                </div>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
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
