'use client';

import { useState } from 'react';
import { Plus, Calendar, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { useGetAttendanceReportQuery, useGetLeaveReportQuery, useGetPerformanceReportQuery } from '@/store/services/reportsApi';
import ReportsFilters from './components/ReportsFilters';
import ReportsSummaryCards from './components/ReportsSummaryCards';
import ReportCategories from './components/ReportCategories';
import ReportsTable from './components/ReportsTable';
import WorkforceAnalytics from './components/WorkforceAnalytics';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import PayrollAnalytics from './components/PayrollAnalytics';
import LeaveAnalytics from './components/LeaveAnalytics';
import CustomReportBuilder from './components/CustomReportBuilder';
import ScheduledReports from './components/ScheduledReports';
import AuditLogs from './components/AuditLogs';
import QuickReports from './components/QuickReports';

export default function Page() {
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // Redux API calls
  const { data: attendanceReport, isLoading: attendanceLoading } = useGetAttendanceReportQuery({});
  const { data: leaveReport, isLoading: leaveLoading } = useGetLeaveReportQuery({});
  const { data: performanceReport, isLoading: performanceLoading } = useGetPerformanceReportQuery({});

  const handleGenerateReport = () => {
    alert('Generating report...');
  };

  const handleScheduleReport = () => {
    alert('Scheduling report...');
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    alert('Exporting to PDF...');
  };

  const handleExportCSV = () => {
    alert('Exporting to CSV...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Reports & Analytics</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Centralized reporting module for HR, Payroll, Attendance, Leave, Employees, Finance, and Performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </button>
          <button
            onClick={handleScheduleReport}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule Report
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <ReportsFilters />
      </div>

      {/* Summary Cards */}
      <ReportsSummaryCards />

      {/* Quick Reports */}
      <QuickReports />

      {/* Report Categories */}
      <ReportCategories />

      {/* Reports Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <ReportsTable />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkforceAnalytics />
        <AttendanceAnalytics />
        <PayrollAnalytics />
        <LeaveAnalytics />
      </div>

      {/* Custom Report Builder */}
      {showCustomBuilder && <CustomReportBuilder onClose={() => setShowCustomBuilder(false)} />}

      {/* Scheduled Reports */}
      <ScheduledReports />

      {/* Audit Logs */}
      <AuditLogs />
    </div>
  );
}
