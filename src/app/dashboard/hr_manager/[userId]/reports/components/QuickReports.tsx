'use client';

import { Zap } from 'lucide-react';

export default function QuickReports() {
  const quickReports = [
    { name: 'Today\'s Attendance', icon: '📊', color: 'bg-blue-500' },
    { name: 'Monthly Payroll', icon: '💰', color: 'bg-green-500' },
    { name: 'Leave Summary', icon: '📅', color: 'bg-amber-500' },
    { name: 'Employee Directory', icon: '👥', color: 'bg-purple-500' },
    { name: 'Department Summary', icon: '🏢', color: 'bg-teal-500' },
    { name: 'Performance Overview', icon: '📈', color: 'bg-indigo-500' },
  ];

  const handleQuickReport = (reportName: string) => {
    alert(`Generating ${reportName}...`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-500" />
        Quick Reports
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">One-click report generation</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {quickReports.map((report, index) => (
          <button
            key={index}
            onClick={() => handleQuickReport(report.name)}
            className={`${report.color} p-4 rounded-lg text-white text-center hover:opacity-90 transition-opacity`}
          >
            <div className="text-2xl mb-2">{report.icon}</div>
            <p className="text-xs font-medium">{report.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
