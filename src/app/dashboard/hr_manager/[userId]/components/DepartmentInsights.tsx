'use client';

import { Building2, Hotel, Home, Shirt } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import { useGetDepartmentInsightsQuery } from '@/store/services/dashboardApi';

const departmentIcons: Record<string, any> = {
  'Real Estate': Building2,
  'Hotels': Hotel,
  'Saree Mfg': Shirt,
  'Saree Manufacturing': Shirt,
  'Corporate HO': Home,
  'Corporate Office': Home,
  'Corporate': Home,
};

export default function DepartmentInsights() {
  const { data: departmentData, isLoading } = useGetDepartmentInsightsQuery({});

  const departments = Array.isArray(departmentData?.data) ? departmentData.data : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
              {[1, 2, 3, 4].map((j) => (
                <div key={j}>
                  <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-1"></div>
                  <div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No department data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {departments.map((d: any) => {
        const name = d.name || d.departmentName || 'Unknown';
        const total = d.total || d.totalEmployees || d.employeeCount || 0;
        const present = d.present || 0;
        const absent = d.absent || 0;
        const leave = d.leave || d.onLeave || 0;
        const gps = d.gps || d.gpsUsers || 0;
        const Icon = departmentIcons[name] || Building2;
        
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return (
          <Card key={d._id || d.id || name} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#94cb3d]/10 text-[#94cb3d]">
                <Icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">Present</p>
                <p className="font-semibold text-green-600">{present}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">Absent</p>
                <p className="font-semibold text-red-600">{absent}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">On Leave</p>
                <p className="font-semibold text-blue-600">{leave}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">GPS</p>
                <p className="font-semibold text-purple-600">{gps}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-zinc-500">Attendance</span>
                <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">{attendanceRate}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-[#94cb3d]" style={{ width: `${attendanceRate}%` }} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
