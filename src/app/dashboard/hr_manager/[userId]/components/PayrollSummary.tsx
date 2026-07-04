'use client';

import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card/Card';
import { useGetPayrollSummaryQuery } from '@/store/services/dashboardApi';

const payrollItemsConfig = [
  { label: 'Payroll Completed', key: 'payrollCompleted' as const, icon: CheckCircle, color: 'text-green-600' },
  { label: 'Overtime Hours', key: 'overtimeHours' as const, icon: Clock, color: 'text-amber-600' },
  { label: 'Pending Issues', key: 'pendingIssues' as const, icon: AlertCircle, color: 'text-red-600' },
  { label: 'Total Payout', key: 'totalPayout' as const, icon: DollarSign, color: 'text-blue-600' },
];

export default function PayrollSummary() {
  const currentMonth = new Date().toLocaleString('en', { month: 'long', year: 'numeric' });
  const { data: payrollData, isLoading } = useGetPayrollSummaryQuery(currentMonth);

  const payrollStats = payrollData?.data || {};
  const payrollCompleted = payrollStats.payrollCompleted || 92;
  const overtimeHours = payrollStats.overtimeHours || 146;
  const pendingIssues = payrollStats.pendingIssues || 4;
  const totalPayout = payrollStats.totalPayout || '₹18.4L';

  const payrollItems = payrollItemsConfig.map((config) => ({
    ...config,
    value: payrollStats[config.key] || (
      config.key === 'payrollCompleted' ? '92%' :
      config.key === 'overtimeHours' ? '146 hrs' :
      config.key === 'pendingIssues' ? '4' :
      config.key === 'totalPayout' ? '₹18.4L' : '0'
    ),
  }));

  if (isLoading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded shrink-0 mt-0.5"></div>
              <div>
                <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded mb-1"></div>
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-2"></div>
        <div className="h-3 w-64 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Payroll Snapshot – {currentMonth}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {payrollItems.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon className={`h-5 w-5 ${item.color} shrink-0 mt-0.5`} />
            <div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{item.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full bg-green-500" style={{ width: `${payrollCompleted}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-500">Payroll processing is {payrollCompleted}% complete. {pendingIssues} salary issues pending.</p>
    </Card>
  );
}
