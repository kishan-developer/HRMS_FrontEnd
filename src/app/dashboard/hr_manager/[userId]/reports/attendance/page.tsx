'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Download, Filter, FileText, BarChart3, Users, Clock, AlertCircle } from 'lucide-react';
import { useGetAttendanceReportQuery, useGetLeaveReportQuery } from '@/store/services/reportsApi';
import { useGetAttendanceSummaryQuery, useGetAllEmployeesAttendanceQuery } from '@/store/services/attendanceApi';

type DateFilter = 'today' | 'week' | 'month' | 'custom';

export default function AttendanceReportsPage() {
  const { userId } = useParams();
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
  const { data: attendanceReport, isLoading: reportLoading } = useGetAttendanceReportQuery({});
  const { data: attendanceSummary, isLoading: summaryLoading } = useGetAttendanceSummaryQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  const { data: allEmployeesAttendance, isLoading: employeesLoading } = useGetAllEmployeesAttendanceQuery(dateRange.startDate);

  // Extract data from API responses
  const reportData = Array.isArray(attendanceReport?.data) ? attendanceReport.data : [];
  const summary = attendanceSummary?.data || {};
  const employeesData = Array.isArray(allEmployeesAttendance?.data) ? allEmployeesAttendance.data : [];

  // Calculate stats
  const totalEmployees = employeesData.length || summary.totalEmployees || 0;
  const presentToday = summary.present || 0;
  const absentToday = summary.absent || 0;
  const lateArrivals = summary.late || 0;
  const earlyDepartures = summary.earlyOut || 0;
  const averageHours = summary.avgHours || 0;
  const overtimeHours = summary.overtime || 0;

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    return employeesData.filter((record: any) => {
      if (selectedDepartment !== 'all' && record.department !== selectedDepartment) return false;
      if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
      return true;
    });
  }, [employeesData, selectedDepartment, selectedStatus]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Check In', 'Check Out', 'Hours', 'Status', 'Late (min)', 'Early Out (min)', 'Overtime (hrs)'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...filteredRecords.map((r: any) =>
        [
          r.date || '-',
          r.employeeId || '-',
          r.name || '-',
          r.department || '-',
          r.checkIn || '-',
          r.checkOut || '-',
          r.totalHours || '0',
          r.status || '-',
          r.lateMinutes || '0',
          r.earlyOutMinutes || '0',
          r.overtimeHours || '0',
        ].map(escape).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const html = `<!doctype html><html><head><title>Attendance Report</title>
<style>body{font-family:sans-serif;padding:20px}h1{font-size:18px;margin:0 0 12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #ddd;padding:5px;text-align:left}th{background:#f5f5f5}.meta{color:#666;font-size:11px;margin-bottom:10px}</style>
</head><body>
<h1>Attendance Report</h1>
<div class="meta">${dateRange.startDate} → ${dateRange.endDate} · ${filteredRecords.length} records</div>
<table><thead><tr><th>Date</th><th>Employee</th><th>Department</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
<tbody>${filteredRecords.map((r: any) => `<tr><td>${r.date || '-'}</td><td>${r.name || '-'}</td><td>${r.department || '-'}</td><td>${r.checkIn || '-'}</td><td>${r.checkOut || '-'}</td><td>${r.totalHours || '0'}</td><td>${r.status || '-'}</td></tr>`).join('')}</tbody></table>
<script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Attendance Reports</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Comprehensive attendance analytics and reporting</p>
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
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Employees</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Present Today</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{presentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Absent Today</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{absentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Late Arrivals</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{lateArrivals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Average Hours</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{averageHours.toFixed(1)}h</p>
            </div>
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Early Departures</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{earlyDepartures}</p>
            </div>
            <AlertCircle className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Overtime</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{overtimeHours.toFixed(1)}h</p>
            </div>
            <BarChart3 className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Attendance Records</h2>
          <span className="text-xs text-zinc-500">{filteredRecords.length} records</span>
        </div>
        
        {employeesLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading attendance data...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No attendance records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Late (min)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Overtime (hrs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredRecords.slice(0, 50).map((record: any, index: number) => (
                  <tr key={record.id || record.employeeId || index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.date || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{record.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.department || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.checkIn || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.checkOut || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.totalHours || '0'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {record.status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.lateMinutes || '0'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{record.overtimeHours || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Attendance Analytics</h2>
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
