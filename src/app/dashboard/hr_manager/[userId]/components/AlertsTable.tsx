'use client';

import { AlertTriangle, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge/Badge';
import Card from '@/components/ui/Card/Card';

const alerts = [
  { id: 1, type: 'Missing Attendance', detail: 'Biometric not synced for 4 employees', severity: 'warning' as const, vertical: 'Real Estate' },
  { id: 2, type: 'Location Mismatch', detail: 'GPS check-in outside assigned site', severity: 'error' as const, vertical: 'Hotels' },
  { id: 3, type: 'Suspicious Photo', detail: 'Face verification failed for 2 entries', severity: 'warning' as const, vertical: 'Saree' },
  { id: 4, type: 'ID Expiring', detail: '3 employee work permits expire in 7 days', severity: 'info' as const, vertical: 'HO' },
  { id: 5, type: 'Attendance Sync', detail: 'Mobile app sync delayed by 3 hours', severity: 'warning' as const, vertical: 'Real Estate' },
];

export default function AlertsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Compliance & Alerts</h3>
        </div>
        <Badge variant="warning">{alerts.length} Open</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800 text-xs uppercase text-zinc-500 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Alert Type</th>
              <th className="px-4 py-3 font-semibold">Detail</th>
              <th className="px-4 py-3 font-semibold">Vertical</th>
              <th className="px-4 py-3 font-semibold">Severity</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {alerts.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{a.type}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{a.detail}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{a.vertical}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.severity} size="sm">{a.severity}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="p-1.5 rounded-md text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
