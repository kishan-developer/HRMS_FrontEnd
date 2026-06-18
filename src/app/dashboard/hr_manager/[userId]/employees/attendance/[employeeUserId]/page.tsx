'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, Mail, Calendar, MapPin, Clock, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { useGetEmployeeTwoMonthAttendanceQuery } from '@/store/services/attendanceApi';
import apiCall from '@/lib/api';

export default function EmployeeAttendanceDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmailDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redux API call for 2-month attendance
  const { data: attendanceData, isLoading, refetch } = useGetEmployeeTwoMonthAttendanceQuery(
    employeeId || '',
    { skip: !employeeId }
  );

  const attendanceRecords = attendanceData?.data || [];

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const response = await apiCall(`/api/v1/attendance/employee/${employeeId}/download-report`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-report-${employeeId}-${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async (emailType: 'admin' | 'user') => {
    try {
      setSendingEmail(true);
      const response = await apiCall(`/api/v1/attendance/employee/${employeeId}/send-report-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailType }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Report sent successfully to ${emailType === 'admin' ? 'admin' : 'user'} email!`);
      } else {
        alert('Failed to send report');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send report');
    } finally {
      setSendingEmail(false);
      setShowEmailDropdown(false);
    }
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Employee Attendance Record
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Last 2 months attendance history for Employee ID: {employeeId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download Report'}
          </Button>
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEmailDropdown(!showEmailDropdown)}
              disabled={sendingEmail}
            >
              <Mail className="h-4 w-4 mr-2" />
              {sendingEmail ? 'Sending...' : 'Send to Email'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {showEmailDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-10">
                <button
                  onClick={() => handleSendEmail('admin')}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-t-lg transition-colors"
                >
                  Send to Admin Email
                </button>
                <button
                  onClick={() => handleSendEmail('user')}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-b-lg transition-colors"
                >
                  Send to User Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            Loading attendance data...
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            No attendance records found for the last 2 months
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {attendanceRecords.map((record: any) => (
                  <tr key={record._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#94cb3d]" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#94cb3d]" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {record.punchInTime || '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                      {record.punchOutTime || '--:--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                          {record.punchInLocation?.address || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                      {record.totalHours ? `${record.totalHours}h` : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Days</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {attendanceRecords.length}
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