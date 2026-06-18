'use client';

import { useState } from 'react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  format: string[];
  lastGenerated?: string;
}

const REPORTS: Report[] = [
  {
    id: '1',
    name: 'Employee Summary Report',
    description: 'Comprehensive overview of all employees across companies',
    category: 'Employee',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-03-15',
  },
  {
    id: '2',
    name: 'Attendance Report',
    description: 'Daily, weekly, and monthly attendance statistics',
    category: 'Attendance',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-03-15',
  },
  {
    id: '3',
    name: 'Leave Balance Report',
    description: 'Leave balances and usage for all employees',
    category: 'Leave',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-03-14',
  },
  {
    id: '4',
    name: 'Payroll Summary',
    description: 'Monthly payroll breakdown and payments',
    category: 'Payroll',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-03-01',
  },
  {
    id: '5',
    name: 'Company Performance',
    description: 'Key metrics and performance indicators for each company',
    category: 'Company',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-03-10',
  },
  {
    id: '6',
    name: 'Asset Inventory',
    description: 'Complete inventory of all company assets',
    category: 'Asset',
    format: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-03-05',
  },
  {
    id: '7',
    name: 'Audit Log Report',
    description: 'System activity and audit trail',
    category: 'System',
    format: ['PDF', 'CSV'],
    lastGenerated: '2024-03-15',
  },
  {
    id: '8',
    name: 'Training & Development',
    description: 'Employee training records and progress',
    category: 'HR',
    format: ['PDF', 'Excel'],
    lastGenerated: '2024-02-28',
  },
];

export default function ReportsCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = REPORTS.filter((report) => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(REPORTS.map((r) => r.category)))];

  const handleGenerateReport = (reportId: string, format: string) => {
    console.log(`Generating report ${reportId} in ${format} format`);
    alert(`Report will be generated in ${format.toUpperCase()} format`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Reports Center
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Generate and download system-wide reports
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {report.name}
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300 mt-2">
                  {report.category}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {report.description}
            </p>

            {report.lastGenerated && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">
                Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
              </p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Export Format:</p>
              <div className="flex gap-2">
                {report.format.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleGenerateReport(report.id, fmt)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-[#94cb3d] border border-[#94cb3d] rounded-md hover:bg-[#94cb3d] hover:text-white transition-colors"
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 dark:text-zinc-400">No reports found</p>
        </div>
      )}
    </div>
  );
}
