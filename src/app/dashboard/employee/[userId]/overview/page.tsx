'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, FileText, User } from 'lucide-react';
import { useGetUserQuery } from '@/store/services/userApi';
import { useGetTodayAttendanceQuery } from '@/store/services/attendanceApi';
import { useGetMyPendingLeavesQuery } from '@/store/services/leaveApi';
import { dashboardApi, type EmployeeSummary } from '@/services/dashboardApi';
import StatusBadge from '@/components/ui/StatusBadge';

export default function EmployeeDashboard() {
  const { userId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);

  // Redux API calls
  const { data: userData, isLoading: userLoading } = useGetUserQuery(userId as string, { skip: !userId });
  const { data: todayAttendance, isLoading: attendanceLoading } = useGetTodayAttendanceQuery({});
  const { data: pendingLeaves, isLoading: leavesLoading } = useGetMyPendingLeavesQuery({});

  useEffect(() => {
    dashboardApi.getEmployeeSummary().then((res) => {
      if (res.success) setSummary(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userLoading && !attendanceLoading && !leavesLoading) {
      setLoading(false);
    }
  }, [userLoading, attendanceLoading, leavesLoading]);

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
          Welcome, {userData?.data?.firstName || 'Employee'}!
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your attendance, leaves, and payroll
        </p>
      </div>

      {/* Key Widgets */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Today's Attendance</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {todayAttendance?.data?.status || 'Not Checked In'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {todayAttendance?.data?.punchInTime ? todayAttendance.data.punchInTime : '--'} - {todayAttendance?.data?.punchOutTime || '--'}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Leaves</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {pendingLeaves?.data?.length || 0}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Requests pending approval</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Working Hours</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {todayAttendance?.data?.totalHours || 0}h
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Today's total</p>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Department</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {userData?.data?.departmentId || 'N/A'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{userData?.data?.designation || 'Employee'}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: `/dashboard/employee/${userId}/attendance`, icon: <Clock className="h-5 w-5 text-[#94cb3d]" />, bg: 'bg-[#94cb3d]/20', label: 'Attendance', sub: 'View & mark attendance' },
            { href: `/dashboard/employee/${userId}/leave`, icon: <Calendar className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-500/20', label: 'Apply Leave', sub: 'Request time off' },
            { href: `/dashboard/employee/${userId}/payslips`, icon: <FileText className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-500/20', label: 'My Payslips', sub: 'Download salary slips' },
            { href: `/dashboard/employee/${userId}/profile`, icon: <User className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-500/20', label: 'My Profile', sub: 'Update details' },
          ].map(({ href, icon, bg, label, sub }) => (
            <Link key={label} href={href} className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>{icon}</div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Leave Balance */}
      {summary?.leaveBalance && summary.leaveBalance.length > 0 && (
        <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Leave Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summary.leaveBalance.map((lb) => (
              <div key={lb.leaveType} className="text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{lb.balance}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{lb.leaveType}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{lb.used} used / {lb.total} total</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Monthly Summary */}
      {summary?.monthlySummary && (
        <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">This Month</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Present', value: summary.monthlySummary.present, color: 'text-green-600 dark:text-green-400' },
              { label: 'Absent', value: summary.monthlySummary.absent, color: 'text-red-600 dark:text-red-400' },
              { label: 'Late', value: summary.monthlySummary.late, color: 'text-orange-600 dark:text-orange-400' },
              { label: 'Working Days', value: summary.monthlySummary.workingDays, color: 'text-zinc-900 dark:text-zinc-50' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
