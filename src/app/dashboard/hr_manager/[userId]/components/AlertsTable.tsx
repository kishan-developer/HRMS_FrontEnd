'use client';

import { AlertTriangle, Eye, Check } from 'lucide-react';
import Badge from '@/components/ui/Badge/Badge';
import Card from '@/components/ui/Card/Card';
import { useGetAlertsQuery, useResolveAlertMutation } from '@/store/services/dashboardApi';

export default function AlertsTable() {
  const { data: alertsData, isLoading } = useGetAlertsQuery({});
  const [resolveAlert] = useResolveAlertMutation();

  const alerts = Array.isArray(alertsData?.data) ? alertsData.data : [];

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId).unwrap();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          </div>
          <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Compliance & Alerts</h3>
        </div>
        <Badge variant="warning">{alerts.length} Open</Badge>
      </div>
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          No alerts at this time
        </div>
      ) : (
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
              {alerts.map((a: any) => {
                const id = a._id || a.id;
                const type = a.type || a.alertType || 'Unknown';
                const detail = a.detail || a.description || 'No details';
                const vertical = a.vertical || a.department || 'N/A';
                const severity = a.severity || 'info';

                return (
                  <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{type}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{detail}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{vertical}</td>
                    <td className="px-4 py-3">
                      <Badge variant={severity} size="sm">{severity}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          type="button" 
                          className="p-1.5 rounded-md text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleResolve(id)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="Resolve Alert"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
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
