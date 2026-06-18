'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, UserCheck, UserX, Clock, MapPin, Briefcase, UserPlus, LogOut, Calendar } from 'lucide-react';
import StatsCard from '@/components/ui/Card/StatsCard';
import OverviewHeader from '../components/OverviewHeader';
import AttendanceChartCard from '../components/AttendanceChartCard';
import GpsSummary from '../components/GpsSummary';
import LeaveSummary from '../components/LeaveSummary';
import PayrollSummary from '../components/PayrollSummary';
import AlertsTable from '../components/AlertsTable';
import DepartmentInsights from '../components/DepartmentInsights';
import RecentCheckinsTable from '../components/RecentCheckinsTable';
import { useGetUserQuery } from '@/store/services/userApi';
import { useGetMyPendingLeavesQuery } from '@/store/services/leaveApi';
import { useGetAttendanceSummaryQuery, useGetTodayAttendanceQuery } from '@/store/services/attendanceApi';
import { useGetAllUsersQuery } from '@/store/services/userApi';

type DateFilter = 'today' | 'week' | 'month' | 'custom';

export default function AdminDashboard() {
  const { userId } = useParams();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (dateFilter) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() + (6 - dayOfWeek));
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        if (customStartDate) start.setTime(new Date(customStartDate).getTime());
        if (customEndDate) end.setTime(new Date(customEndDate).getTime());
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [dateFilter, customStartDate, customEndDate]);

  // Redux API calls
  const { data: userData } = useGetUserQuery(userId as string, { skip: !userId });
  const { data: pendingLeaves } = useGetMyPendingLeavesQuery({});
  const { data: attendanceSummary, refetch: refetchAttendance } = useGetAttendanceSummaryQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: todayAttendance } = useGetTodayAttendanceQuery({});

  // Refetch attendance data when date range changes
  useEffect(() => {
    refetchAttendance();
  }, [dateRange, refetchAttendance]);

  // Get stats from API responses
  const totalEmployees = usersData?.data?.users?.length || usersData?.data?.items?.length || usersData?.data?.length || 0;
  const summary = attendanceSummary?.data || {};
  const presentToday = summary.present || 0;
  const absentToday = summary.absent || 0;
  const lateArrivals = summary.late || 0;
  const outdoorDuty = summary.outdoor || 0;
  const onLeave = pendingLeaves?.data?.length || 0;
  const newJoinees = summary.newJoinees || 0;
  const exits = summary.exits || 0;

  // Get recent check-ins from attendance data
  const recentCheckins = todayAttendance?.data?.checkins || todayAttendance?.data || summary?.recentCheckins || [];

  return (
    <div className="space-y-8">
      <OverviewHeader 
        stats={{
          totalEmployees,
          presentToday,
          absentToday,
          lateArrivals,
          outdoorDuty,
          onLeave,
          newJoinees,
          exits,
        }}
        dateRange={dateRange}
        userData={userData}
        userId={userId as string}
      />

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Date Filter:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'today'
                ? 'bg-[#94cb3d] text-white'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('week')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'week'
                ? 'bg-[#94cb3d] text-white'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDateFilter('month')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'month'
                ? 'bg-[#94cb3d] text-white'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setDateFilter('custom')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'custom'
                ? 'bg-[#94cb3d] text-white'
                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            Custom
          </button>
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <span className="text-zinc-500 dark:text-zinc-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Employees" value={String(totalEmployees)} icon={Users} />
          <StatsCard title="Present Today" value={String(presentToday)} icon={UserCheck} trend={totalEmployees > 0 ? `${Math.round((presentToday / totalEmployees) * 100)}%` : '0%'} trendUp />
          <StatsCard title="Absent Today" value={String(absentToday)} icon={UserX} trendUp={false} />
          <StatsCard title="Late Arrivals" value={String(lateArrivals)} icon={Clock} trendUp={false} />
          <StatsCard title="Outdoor Duty" value={String(outdoorDuty)} icon={MapPin} trend="On field" trendUp />
          <StatsCard title="On Leave" value={String(onLeave)} icon={Briefcase} />
          <StatsCard title="New Joinees (30d)" value={String(newJoinees)} icon={UserPlus} trend="Active" trendUp />
          <StatsCard title="Exits (30d)" value={String(exits)} icon={LogOut} trend="Low" trendUp />
        </div>
      </section>

      {/* Attendance Overview */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Attendance Overview
        </h2>
        <AttendanceChartCard />
      </section>

      {/* Live GPS Summary */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Live GPS Summary
        </h2>
        <GpsSummary />
      </section>

      {/* Leave & Holidays */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Leave & Holidays
        </h2>
        <LeaveSummary />
      </section>

      {/* Payroll Snapshot */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Payroll Snapshot
        </h2>
        <PayrollSummary />
      </section>

      {/* Compliance & Alerts */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Compliance & Alerts
        </h2>
        <AlertsTable />
      </section>

      {/* Department/Vertical Insights */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Department Insights
        </h2>
        <DepartmentInsights />
      </section>

      {/* Recent Check-ins */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
          Recent Check-ins
        </h2>
        <RecentCheckinsTable checkins={recentCheckins} />
      </section>
    </div>
  );
}
