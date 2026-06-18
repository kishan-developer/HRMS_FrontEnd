'use client';

import { useState } from 'react';
import { useGetMonthlyCalendarQuery } from '@/store/services/attendanceApi';
import Card from '@/components/ui/Card/Card';
import Table from '@/components/ui/Table/Table';
import TableHead from '@/components/ui/Table/TableHead';
import TableBody from '@/components/ui/Table/TableBody';
import TableRow from '@/components/ui/Table/TableRow';
import TableCell from '@/components/ui/Table/TableCell';

type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late' | 'early-out' | 'weekly-off' | 'holiday';

interface EmployeeDayData {
  day: number;
  status: AttendanceStatus;
  inTime?: string;
  outTime?: string;
  hours?: string;
}

interface EmployeeMonthlyData {
  id: string;
  _id?: string;
  name: string;
  employeeId: string;
  department: string;
  shift: string;
  days: EmployeeDayData[];
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  totalLate: number;
  totalEarlyOut: number;
  totalHours: string;
  attendancePercentage: number;
}

const statusColors: Record<AttendanceStatus, string> = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  leave: 'bg-blue-500',
  late: 'bg-amber-500',
  'early-out': 'bg-orange-500',
  'weekly-off': 'bg-zinc-400',
  holiday: 'bg-zinc-600',
};

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  leave: 'Leave',
  late: 'Late',
  'early-out': 'Early Out',
  'weekly-off': 'Weekly Off',
  holiday: 'Holiday',
};

export default function EmployeeMonthlyTable() {
  const [hoveredCell, setHoveredCell] = useState<{ employeeId: string; day: number } | null>(null);

  // Redux API call
  const { data: calendarData, isLoading } = useGetMonthlyCalendarQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const employeeData = calendarData?.data || [];

  return (
    <Card className="p-6">
      {isLoading ? (
        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">Loading...</div>
      ) : employeeData.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">No data available</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Employee-Wise Monthly Attendance
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span className="text-zinc-600 dark:text-zinc-400">Early Out</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="sticky left-0 bg-white dark:bg-zinc-900 z-10 min-w-[150px]">
                    Employee Name
                  </TableCell>
                  <TableCell className="sticky left-[150px] bg-white dark:bg-zinc-900 z-10 min-w-[100px]">
                    Employee ID
                  </TableCell>
                  <TableCell className="sticky left-[250px] bg-white dark:bg-zinc-900 z-10 min-w-[120px]">
                    Department
                  </TableCell>
                  <TableCell className="sticky left-[370px] bg-white dark:bg-zinc-900 z-10 min-w-[120px]">
                    Shift
                  </TableCell>
                  {Array.from({ length: 31 }, (_, i) => (
                    <TableCell key={i} className="min-w-[35px] text-center p-2">
                      {i + 1}
                    </TableCell>
                  ))}
                  <TableCell className="min-w-[80px] text-center">Present</TableCell>
                  <TableCell className="min-w-[80px] text-center">Absent</TableCell>
                  <TableCell className="min-w-[80px] text-center">Leave</TableCell>
                  <TableCell className="min-w-[80px] text-center">Late</TableCell>
                  <TableCell className="min-w-[80px] text-center">Early Out</TableCell>
                  <TableCell className="min-w-[100px] text-center">Total Hours</TableCell>
                  <TableCell className="min-w-[100px] text-center">Attendance %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((employee: EmployeeMonthlyData) => (
                  <TableRow key={employee._id || employee.id}>
                    <TableCell className="sticky left-0 bg-white dark:bg-zinc-900 z-10 font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell className="sticky left-[150px] bg-white dark:bg-zinc-900 z-10 text-zinc-600 dark:text-zinc-400">
                      {employee.employeeId}
                    </TableCell>
                    <TableCell className="sticky left-[250px] bg-white dark:bg-zinc-900 z-10">
                      {employee.department}
                    </TableCell>
                    <TableCell className="sticky left-[370px] bg-white dark:bg-zinc-900 z-10 text-zinc-600 dark:text-zinc-400">
                      {employee.shift}
                    </TableCell>
                    {employee.days.map((day) => (
                      <TableCell key={day.day} className="p-1 text-center">
                        <div
                          className={`w-7 h-7 mx-auto rounded ${statusColors[day.status]} cursor-pointer hover:opacity-80 transition-opacity relative`}
                          onMouseEnter={() => setHoveredCell({ employeeId: employee.id, day: day.day })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {/* Tooltip */}
                          {hoveredCell?.employeeId === employee.id && hoveredCell?.day === day.day && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg shadow-lg whitespace-nowrap z-20">
                              <div className="font-medium">{statusLabels[day.status]}</div>
                              {day.inTime && day.outTime && (
                                <div className="mt-1 text-zinc-300 dark:text-zinc-700">
                                  {day.inTime} - {day.outTime} ({day.hours})
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium text-green-600 dark:text-green-400">
                      {employee.totalPresent}
                    </TableCell>
                    <TableCell className="text-center font-medium text-red-600 dark:text-red-400">
                      {employee.totalAbsent}
                    </TableCell>
                    <TableCell className="text-center font-medium text-blue-600 dark:text-blue-400">
                      {employee.totalLeave}
                    </TableCell>
                    <TableCell className="text-center font-medium text-amber-600 dark:text-amber-400">
                      {employee.totalLate}
                    </TableCell>
                    <TableCell className="text-center font-medium text-orange-600 dark:text-orange-400">
                      {employee.totalEarlyOut}
                    </TableCell>
                    <TableCell className="text-center">
                      {employee.totalHours}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${employee.attendancePercentage >= 90 ? 'text-green-600 dark:text-green-400' : employee.attendancePercentage >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                        {employee.attendancePercentage}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>
  );
}
