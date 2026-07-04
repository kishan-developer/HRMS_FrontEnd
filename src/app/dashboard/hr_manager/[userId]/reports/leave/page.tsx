'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Download, Filter, FileText, BarChart3, Users, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import { useGetLeaveReportQuery } from '@/store/services/reportsApi';
import { useGetAllLeavesQuery, useGetHolidaysQuery, useGetLeaveTypesQuery } from '@/store/services/leaveApi';

type DateFilter = 'today' | 'week' | 'month' | 'custom';

export default function LeaveReportsPage() {
  const { userId } = useParams();
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');

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
  const { data: leaveReport, isLoading: reportLoading } = useGetLeaveReportQuery({});
  const { data: allLeaves, isLoading: leavesLoading } = useGetAllLeavesQuery({});
  const { data: holidays, isLoading: holidaysLoading } = useGetHolidaysQuery({});
  const { data: leaveTypes, isLoading: typesLoading } = useGetLeaveTypesQuery({});

  // Extract data from API responses
  const reportData = Array.isArray(leaveReport?.data) ? leaveReport.data : [];
  const leavesData = Array.isArray(allLeaves?.data?.leaves) ? allLeaves.data.leaves : Array.isArray(allLeaves?.data) ? allLeaves.data : [];
  const holidaysData = Array.isArray(holidays?.data) ? holidays.data : [];
  const leaveTypesData = Array.isArray(leaveTypes?.data) ? leaveTypes.data : [];

  // Calculate stats
  const totalLeaves = leavesData.length;
  const pendingLeaves = leavesData.filter((l: any) => l.status === 'pending').length;
  const approvedLeaves = leavesData.filter((l: any) => l.status === 'approved').length;
  const rejectedLeaves = leavesData.filter((l: any) => l.status === 'rejected').length;
  const totalHolidays = holidaysData.length;
  const totalLeaveTypes = leaveTypesData.length;

  // Filter leave records
  const filteredLeaves = useMemo(() => {
    return leavesData.filter((leave: any) => {
      if (selectedDepartment !== 'all' && leave.department !== selectedDepartment) return false;
      if (selectedStatus !== 'all' && leave.status !== selectedStatus) return false;
      if (selectedLeaveType !== 'all' && leave.leaveType !== selectedLeaveType) return false;
      return true;
    });
  }, [leavesData, selectedDepartment, selectedStatus, selectedLeaveType]);

  const handleExportCSV = () => {
    const headers = ['Employee', 'Department', 'Leave Type', 'From Date', 'To Date', 'Days', 'Reason', 'Status', 'Applied On'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...filteredLeaves.map((l: any) =>
        [
          l.employeeName || '-',
          l.department || '-',
          l.leaveType || '-',
          l.fromDate || '-',
          l.toDate || '-',
          l.days || '0',
          l.reason || '-',
          l.status || '-',
          l.appliedOn || '-',
        ].map(escape).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-report-${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const html = `<!doctype html><html><head><title>Leave Report</title>
<style>body{font-family:sans-serif;padding:20px}h1{font-size:18px;margin:0 0 12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #ddd;padding:5px;text-align:left}th{background:#f5f5f5}.meta{color:#666;font-size:11px;margin-bottom:10px}</style>
</head><body>
<h1>Leave Report</h1>
<div class="meta">${dateRange.startDate} → ${dateRange.endDate} · ${filteredLeaves.length} records</div>
<table><thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
<tbody>${filteredLeaves.map((l: any) => `<tr><td>${l.employeeName || '-'}</td><td>${l.department || '-'}</td><td>${l.leaveType || '-'}</td><td>${l.fromDate || '-'}</td><td>${l.toDate || '-'}</td><td>${l.days || '0'}</td><td>${l.status || '-'}</td></tr>`).join('')}</tbody></table>
<script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    const safeStatus = status || 'pending';
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[safeStatus as keyof typeof styles] || styles.pending}`}>
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Leave Reports</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Comprehensive leave analytics and reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Filters:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-zinc-500 dark:text-zinc-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            )}
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {/* Leave Type Filter */}
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="all">All Leave Types</option>
              {leaveTypesData.map((type: any) => (
                <option key={type._id || type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Leaves</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Pending</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{pendingLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Approved</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{approvedLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Rejected</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{rejectedLeaves}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Holidays</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{totalHolidays}</p>
            </div>
            <CalendarDays className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Leave Types</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{totalLeaveTypes}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Leave Records Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Leave Requests</h2>
          <span className="text-xs text-zinc-500">{filteredLeaves.length} records</span>
        </div>
        
        {leavesLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading leave data...</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No leave records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">From Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">To Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredLeaves.slice(0, 50).map((leave: any, index: number) => (
                  <tr key={leave._id || leave.id || index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{leave.employeeName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.department || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.leaveType || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.fromDate || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.toDate || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.days || '0'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{leave.reason || '-'}</td>
                    <td className="px-4 py-3">{getStatusBadge(leave.status)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{leave.appliedOn || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Holidays */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Upcoming Holidays</h2>
          <span className="text-xs text-zinc-500">{holidaysData.length} holidays</span>
        </div>
        
        {holidaysLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading holidays...</p>
          </div>
        ) : holidaysData.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No holidays found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidaysData.slice(0, 6).map((holiday: any, index: number) => (
              <div key={holiday._id || holiday.id || index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">{holiday.date || '-'}</span>
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{holiday.name || 'Holiday'}</p>
                <p className="text-xs text-zinc-500 mt-1">{holiday.type || 'Public Holiday'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Leave Analytics</h2>
        <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Analytics charts will be displayed here</p>
            <p className="text-xs text-zinc-400 mt-1">Connect chart library for visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
