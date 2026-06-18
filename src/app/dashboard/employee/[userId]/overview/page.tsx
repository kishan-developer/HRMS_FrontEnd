'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText, User } from 'lucide-react';
import { useGetUserQuery } from '@/store/services/userApi';
import { useGetTodayAttendanceQuery } from '@/store/services/attendanceApi';
import { useGetMyPendingLeavesQuery } from '@/store/services/leaveApi';

export default function EmployeeDashboard() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);

  // Redux API calls
  const { data: userData, isLoading: userLoading } = useGetUserQuery(userId as string, { skip: !userId });
  const { data: todayAttendance, isLoading: attendanceLoading } = useGetTodayAttendanceQuery({});
  const { data: pendingLeaves, isLoading: leavesLoading } = useGetMyPendingLeavesQuery({});

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
          <button className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#94cb3d] bg-opacity-20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#94cb3d]" />
            </div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">Mark Attendance</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Check in/out</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">Apply Leave</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Request time off</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">View Payslips</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Download salary</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center">
              <User className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">My Profile</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Update details</p>
            </div>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Marked attendance for today', time: '2 hours ago', status: 'success' },
            { action: 'Leave request approved for June 10-12', time: '1 day ago', status: 'success' },
            { action: 'Payslip for May 2026 available', time: '2 days ago', status: 'info' },
            { action: 'Profile information updated', time: '3 days ago', status: 'success' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <p className="text-sm text-zinc-900 dark:text-zinc-50">{activity.action}</p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
