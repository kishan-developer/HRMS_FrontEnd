'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Download, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import { useGetAllEmployeesAttendanceQuery } from '@/store/services/attendanceApi';
import Button from '@/components/ui/Button/Button';

export default function Page() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [refreshKey, setRefreshKey] = useState(0);

  // Redux API call for all employees attendance
  const { data: attendanceData, isLoading, refetch } = useGetAllEmployeesAttendanceQuery(selectedDate);

  const attendanceRecords = attendanceData?.data || [];

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    refetch();
  };

  const handleExport = () => {
    alert('Exporting attendance data...');
  };

  const handleView = (employeeId: string, userId: string) => {
    // Ensure userId is a string, extract from object if needed
    const userIdString = typeof userId === 'object' ? (userId as any)._id || String(userId) : userId;
    router.push(`/dashboard/hr_manager/[userId]/employees/attendance/${userIdString}?employeeId=${employeeId}`);
  };

  // Group attendance records by employee to show multiple entries
  const groupedAttendance = attendanceRecords.reduce((acc: any, record: any) => {
    const empId = record.employeeId;
    if (!acc[empId]) {
      acc[empId] = [];
    }
    acc[empId].push(record);
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Leave':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Employee Attendance</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-time attendance tracking from mobile check-ins</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          />
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Display */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#94cb3d]" />
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {formatDate(selectedDate)}
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Loading attendance data...</div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">No attendance records found for this date</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Working Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {Object.entries(groupedAttendance).map(([empId, records]: [string, any]) => (
                  records.map((record: any, index: number) => (
                    <tr key={record._id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${index > 0 ? 'bg-zinc-50/50 dark:bg-zinc-800/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {(record.userId as any)?.name || 'Unknown'}
                          {records.length > 1 && (
                            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                              (#{index + 1} of {records.length})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {(record.userId as any)?.email || ''}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {record.employeeId || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {(record.userId as any)?.department || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-[#94cb3d]" />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                            {record.punchInTime || '--:--'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {record.punchOutTime || '--:--'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={record.punchInLocation?.address || 'N/A'}>
                            {record.punchInLocation?.address || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {record.totalHours ? `${record.totalHours}h` : '--'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleView(record.employeeId, (record.userId as any)?._id || record.userId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#94cb3d] hover:bg-[#94cb3d] hover:text-white rounded-lg transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Employees</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {Object.keys(groupedAttendance).length}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Present</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {attendanceRecords.filter((r: any) => r.status === 'Present').length}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Late</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
            {attendanceRecords.filter((r: any) => r.status === 'Late').length}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Absent</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {attendanceRecords.filter((r: any) => r.status === 'Absent').length}
          </div>
        </div>
      </div>
    </div>
  );
}
