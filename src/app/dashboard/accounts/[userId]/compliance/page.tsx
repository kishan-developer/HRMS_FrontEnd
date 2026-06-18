'use client';

import { useState } from 'react';

interface ComplianceRecord {
  id: string;
  type: 'PF' | 'ESI' | 'PT' | 'Labour';
  month: string;
  year: string;
  amount: number;
  status: 'filed' | 'pending' | 'overdue';
  dueDate: string;
  filedDate?: string;
}

export default function ComplianceManagement() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [records, setRecords] = useState<ComplianceRecord[]>([
        {
          id: '1',
          type: 'PF',
          month: 'May',
          year: '2026',
          amount: 2450000,
          status: 'filed',
          dueDate: '2026-06-15',
          filedDate: '2026-06-10',
        },
        {
          id: '2',
          type: 'ESI',
          month: 'May',
          year: '2026',
          amount: 735000,
          status: 'filed',
          dueDate: '2026-06-21',
          filedDate: '2026-06-18',
        },
        {
          id: '3',
          type: 'PT',
          month: 'May',
          year: '2026',
          amount: 15000,
          status: 'pending',
          dueDate: '2026-06-30',
        },
        {
          id: '4',
          type: 'PF',
          month: 'April',
          year: '2026',
          amount: 2450000,
          status: 'filed',
          dueDate: '2026-05-15',
          filedDate: '2026-05-12',
        },
        {
          id: '5',
          type: 'ESI',
          month: 'April',
          year: '2026',
          amount: 735000,
          status: 'filed',
          dueDate: '2026-05-21',
          filedDate: '2026-05-19',
        },
      ]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileCompliance = (id: string) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, status: 'filed' as const, filedDate: new Date().toISOString().split('T')[0] } : record
    ));
  };

  const handleDownloadReport = (id: string) => {
    alert(`Downloading compliance report for ${records.find((r: ComplianceRecord) => r.id === id)?.type}`);
  };

  const handleView = (id: string) => {
    const record = records.find(r => r.id === id);
    if (record) {
      setSelectedRecord(record);
      setShowViewModal(true);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Compliance Management
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage PF, ESI, Professional Tax, and Labour compliance filings
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Types</option>
            <option value="PF">PF</option>
            <option value="ESI">ESI</option>
            <option value="PT">Professional Tax</option>
            <option value="Labour">Labour</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Status</option>
            <option value="filed">Filed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Filed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {record.month} {record.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {record.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {record.filedDate || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'filed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : record.status === 'overdue'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {record.status !== 'filed' && (
                        <button 
                          onClick={() => handleFileCompliance(record.id)}
                          className="text-[#94cb3d] hover:text-[#7ab52f]"
                        >
                          File
                        </button>
                      )}
                      <button 
                        onClick={() => handleDownloadReport(record.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Download Report
                      </button>
                      <button 
                        onClick={() => handleView(record.id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">PF Contributions</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">₹4,90,000</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">This Quarter</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">ESI Contributions</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">₹1,47,000</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">This Quarter</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Professional Tax</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">₹15,000</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">This Quarter</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Pending Filings</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">1</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Requires Action</p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-blue-500">📋</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">PF Register</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Monthly report</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-green-500">📋</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">ESI Register</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Monthly report</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <span className="text-purple-500">📋</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">Salary Register</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Complete report</p>
            </div>
          </div>
        </div>
      </div>

      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Compliance Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Compliance Type</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.type}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Month</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.month}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Year</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.year}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Amount</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(selectedRecord.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Status</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.status}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Due Date</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.dueDate}</p>
              </div>
              {selectedRecord.filedDate && (
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Filed Date</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{selectedRecord.filedDate}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedRecord(null);
              }}
              className="mt-6 w-full px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
