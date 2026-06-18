'use client';

import { CheckCircle, Clock, MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge/Badge';
import Card from '@/components/ui/Card/Card';

interface RecentCheckinsTableProps {
  checkins?: any[];
}

export default function RecentCheckinsTable({ checkins = [] }: RecentCheckinsTableProps) {
  // Ensure checkins is always an array
  const safeCheckins = Array.isArray(checkins) ? checkins : [];
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Recent Check-ins</h3>
        <Badge variant="success" size="sm">Live</Badge>
      </div>
      {safeCheckins.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          No recent check-ins
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-xs uppercase text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {safeCheckins.map((c: any) => {
                const id = c._id || c.id;
                const name = c.employeeName || c.name || 'Unknown';
                const time = c.checkInTime || c.time || new Date(c.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const type = c.checkInType || c.type || 'Biometric';
                const status = c.status || (c.isLate ? 'Late' : 'On Time');
                const location = c.location || c.site || 'N/A';

                return (
                  <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{name}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{time}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {type === 'GPS' ? <MapPin className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status === 'On Time' ? 'success' : 'warning'} size="sm">
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
