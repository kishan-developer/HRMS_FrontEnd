'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { useGetAttendanceSummaryQuery, useGetHourlyPunchDistributionQuery, useGetDepartmentAttendanceQuery, useGetRecentActivitiesQuery, useGetWeeklyTrendQuery } from '@/store/services/attendanceApi';
import AttendanceFilters, { AttendanceFilterState } from './components/AttendanceFilters';
import AttendanceSummaryWidgets from './components/AttendanceSummaryWidgets';
import LiveAttendanceStatus from './components/LiveAttendanceStatus';
import QuickActionsPanel from './components/QuickActionsPanel';
import ActivityTimeline from './components/ActivityTimeline';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import HourlyPunchChart from './components/HourlyPunchChart';
import DepartmentBreakdownChart from './components/DepartmentBreakdownChart';
import MarkAttendanceModal from './components/MarkAttendanceModal';
import { ATTENDANCE_EXPORT_ROWS, downloadCSV, exportToPDF } from './components/exportUtils';

const defaultFilters: AttendanceFilterState = {
  date: new Date().toISOString().slice(0, 10),
  department: 'All Departments',
  employee: 'All Employees',
  shift: 'All Shifts',
};

export default function AttendanceDashboardPage() {
  const [filters, setFilters] = useState<AttendanceFilterState>(defaultFilters);
  const [markOpen, setMarkOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Redux API call for attendance summary
  const { data: attendanceSummary, isLoading, refetch } = useGetAttendanceSummaryQuery({});
  const { data: hourlyPunchData } = useGetHourlyPunchDistributionQuery(filters.date);
  const { data: departmentData } = useGetDepartmentAttendanceQuery(filters.date);
  const { data: activitiesData } = useGetRecentActivitiesQuery(20);
  const { data: weeklyTrendData } = useGetWeeklyTrendQuery({});

  const summaryData = attendanceSummary?.data || {};
  const hourlyPunch = hourlyPunchData?.data || hourlyPunchData || {};
  const departmentAttendance = departmentData?.data || departmentData || [];
  const recentActivities = activitiesData?.data || activitiesData || [];
  const weeklyTrend = weeklyTrendData?.data || weeklyTrendData || [];

  const handleExportExcel = () => downloadCSV(ATTENDANCE_EXPORT_ROWS, `attendance-${filters.date}.csv`);
  const handleExportPDF = () => exportToPDF(ATTENDANCE_EXPORT_ROWS, `Attendance Report — ${filters.date}`);
  const handleDownloadReport = () => {
    const choice = window.confirm('Click OK for Excel (CSV), Cancel for PDF.');
    if (choice) handleExportExcel();
    else handleExportPDF();
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Attendance Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time workforce tracking across all verticals
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <AttendanceFilters value={filters} onChange={setFilters} onClear={() => setFilters(defaultFilters)} />

      <AttendanceSummaryWidgets summaryData={summaryData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <WeeklyTrendChart weeklyTrend={weeklyTrend} />
          <HourlyPunchChart hourlyPunch={hourlyPunch} />
        </div>
        <div className="space-y-6">
          <DepartmentBreakdownChart departmentAttendance={departmentAttendance} />
          <QuickActionsPanel onMarkAttendance={() => setMarkOpen(true)} onDownloadReport={handleDownloadReport} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <LiveAttendanceStatus key={refreshKey} summaryData={summaryData} />
        </div>
        <div>
          <ActivityTimeline recentActivities={recentActivities} />
        </div>
      </div>

      <MarkAttendanceModal isOpen={markOpen} onClose={() => setMarkOpen(false)} />
    </div>
  );
}
