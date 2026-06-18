'use client';

import { useState } from 'react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'payroll' | 'salary' | 'tax' | 'compliance' | 'loan' | 'reimbursement';
}

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Payroll Report',
      description: 'Complete monthly payroll breakdown with earnings and deductions',
      category: 'payroll',
    },
    {
      id: '2',
      name: 'Salary Register',
      description: 'Comprehensive salary register for all employees',
      category: 'salary',
    },
    {
      id: '3',
      name: 'Department Salary Report',
      description: 'Salary analysis by department',
      category: 'salary',
    },
    {
      id: '4',
      name: 'Tax Deduction Report',
      description: 'TDS and tax deduction summary',
      category: 'tax',
    },
    {
      id: '5',
      name: 'PF Report',
      description: 'Provident Fund contribution details',
      category: 'compliance',
    },
    {
      id: '6',
      name: 'ESI Report',
      description: 'Employee State Insurance contribution details',
      category: 'compliance',
    },
    {
      id: '7',
      name: 'Loan Report',
      description: 'Employee loans and advances status',
      category: 'loan',
    },
    {
      id: '8',
      name: 'Reimbursement Report',
      description: 'Employee reimbursement summary',
      category: 'reimbursement',
    },
    {
      id: '9',
      name: 'Yearly Payroll Summary',
      description: 'Annual payroll analysis and trends',
      category: 'payroll',
    },
    {
      id: '10',
      name: 'Professional Tax Report',
      description: 'Professional tax filing summary',
      category: 'compliance',
    },
  ];

  const filteredReports = selectedCategory === 'All' 
    ? reports 
    : reports.filter(r => r.category === selectedCategory);

  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    alert(`Generating report: ${reports.find(r => r.id === reportId)?.name}`);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting report in ${format.toUpperCase()} format`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Reports
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Generate and export payroll, salary, tax, and compliance reports
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Categories</option>
            <option value="payroll">Payroll</option>
            <option value="salary">Salary</option>
            <option value="tax">Tax</option>
            <option value="compliance">Compliance</option>
            <option value="loan">Loan</option>
            <option value="reimbursement">Reimbursement</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#94cb3d] bg-opacity-20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                report.category === 'payroll'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : report.category === 'salary'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : report.category === 'tax'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  : report.category === 'compliance'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  : report.category === 'loan'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
              }`}>
                {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              {report.name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {report.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="flex-1 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors text-sm font-medium"
              >
                Generate
              </button>
              <div className="relative">
                <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Export Options</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
