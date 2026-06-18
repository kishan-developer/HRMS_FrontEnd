'use client';

import { useState, useEffect } from 'react';
import SupportHeader from './components/SupportHeader';
import SupportStatsCards from './components/SupportStatsCards';
import RecentTicketsWidget from './components/RecentTicketsWidget';
import PriorityIssuesWidget from './components/PriorityIssuesWidget';
import SupportPerformanceWidget from './components/SupportPerformanceWidget';
import TicketStatusChart from './components/TicketStatusChart';
import MonthlyTrendsChart from './components/MonthlyTrendsChart';

export default function SupportExecutiveDashboard() {
  const [stats, setStats] = useState<any>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    // Fetch dashboard stats from backend
    // This would be replaced with actual API call
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/support/dashboard`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <SupportHeader />
      
      {/* Statistics Cards */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Key Metrics
        </h2>
        <SupportStatsCards stats={stats} />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatusChart />
        <MonthlyTrendsChart />
      </section>

      {/* Widgets Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTicketsWidget />
        </div>
        <PriorityIssuesWidget />
      </section>

      {/* Performance Widget */}
      <section>
        <SupportPerformanceWidget />
      </section>
    </div>
  );
}
