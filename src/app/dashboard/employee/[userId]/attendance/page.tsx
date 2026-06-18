'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetTodayAttendanceQuery, useGetAttendanceByRangeQuery } from '@/store/services/attendanceApi';
import { useCheckInMutation, useCheckOutMutation, useStartBreakMutation, useEndBreakMutation } from '@/store/services/attendanceApi';

export default function EmployeeAttendance() {
  const params = useParams();
  const userId = params.userId as string;

  // Redux API calls
  const { data: todayAttendance, isLoading: todayLoading } = useGetTodayAttendanceQuery({});
  const { data: attendanceRange, isLoading: rangeLoading } = useGetAttendanceByRangeQuery({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mutations
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const [startBreak] = useStartBreakMutation();
  const [endBreak] = useEndBreakMutation();

  const loading = todayLoading || rangeLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading attendance...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Attendance</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">View your attendance records</p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="space-y-4">
          {attendanceRange?.data?.items?.map((record: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  record.status === 'Present' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {record.status === 'Present' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(record.date).toLocaleDateString()}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {record.punchInTime || '--'} - {record.punchOutTime || '--'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                record.status === 'Present'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {record.status}
              </span>
            </div>
          ))}
          {(!attendanceRange?.data?.items || attendanceRange.data.items.length === 0) && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No attendance records found</p>
          )}
        </div>
      </div>
    </div>
  );
}
