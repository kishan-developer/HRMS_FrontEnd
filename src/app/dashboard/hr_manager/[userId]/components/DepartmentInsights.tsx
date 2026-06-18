import { Building2, Hotel, Home, Shirt } from 'lucide-react';
import Card from '@/components/ui/Card/Card';

const departments = [
  { name: 'Real Estate', icon: Building2, total: 62, present: 58, absent: 2, leave: 2, gps: 45 },
  { name: 'Hotels', icon: Hotel, total: 48, present: 46, absent: 1, leave: 1, gps: 42 },
  { name: 'Saree Mfg', icon: Shirt, total: 55, present: 50, absent: 3, leave: 2, gps: 0 },
  { name: 'Corporate HO', icon: Home, total: 85, present: 82, absent: 2, leave: 1, gps: 55 },
];

export default function DepartmentInsights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {departments.map((d) => {
        const attendanceRate = Math.round((d.present / d.total) * 100);
        return (
          <Card key={d.name} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#94cb3d]/10 text-[#94cb3d]">
                <d.icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{d.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">Present</p>
                <p className="font-semibold text-green-600">{d.present}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">Absent</p>
                <p className="font-semibold text-red-600">{d.absent}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">On Leave</p>
                <p className="font-semibold text-blue-600">{d.leave}</p>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400">GPS</p>
                <p className="font-semibold text-purple-600">{d.gps}</p>
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
