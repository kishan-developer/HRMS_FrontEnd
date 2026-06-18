'use client';

import { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';

interface MonthlyPayroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  basicSalary: number;
  earnings: number;
  deductions: number;
  netSalary: number;
  status: 'processed' | 'pending' | 'approved';
  paidDate?: string;
}

export default function PayrollMonthly() {
  const params = useParams();
  const userId = params.userId as string;

  const [selectedMonth, setSelectedMonth] = useState('June 2026');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);

  const [payrollData, setPayrollData] = useState<MonthlyPayroll[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Engineering',
      month: 'June 2026',
      basicSalary: 80000,
      earnings: 40000,
      deductions: 12000,
      netSalary: 108000,
      status: 'processed',
      paidDate: '2026-06-30',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'HR',
      month: 'June 2026',
      basicSalary: 65000,
      earnings: 32500,
      deductions: 9750,
      netSalary: 87750,
      status: 'processed',
      paidDate: '2026-06-30',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Brown',
      department: 'Sales',
      month: 'June 2026',
      basicSalary: 75000,
      earnings: 37500,
      deductions: 11250,
      netSalary: 101250,
      status: 'pending',
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'Engineering',
      month: 'June 2026',
      basicSalary: 90000,
      earnings: 45000,
      deductions: 13500,
      netSalary: 121500,
      status: 'approved',
    },
    {
      id: '5',
      employeeId: 'EMP005',
      employeeName: 'David Wilson',
      department: 'Finance',
      month: 'June 2026',
      basicSalary: 70000,
      earnings: 35000,
      deductions: 10500,
      netSalary: 94500,
      status: 'processed',
      paidDate: '2026-06-30',
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleProcessPayroll = () => {
    setProcessing(true);
    setTimeout(() => {
      setPayrollData(payrollData.map(entry => 
        entry.status === 'pending' ? { ...entry, status: 'processed' as const } : entry
      ));
      setProcessing(false);
    }, 1500);
  };

  const handleApprovePayroll = (id: string) => {
    setPayrollData(payrollData.map(entry => 
      entry.id === id ? { ...entry, status: 'approved' as const } : entry
    ));
  };

  const filteredData = payrollData.filter(entry => {
    const matchesMonth = entry.month === selectedMonth;
    const matchesDepartment = selectedDepartment === 'All' || entry.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || entry.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesDepartment && matchesStatus && matchesSearch;
  });

  const totalEarnings = filteredData.reduce((sum, entry) => sum + entry.earnings, 0);
  const totalDeductions = filteredData.reduce((sum, entry) => sum + entry.deductions, 0);
  const totalNetSalary = filteredData.reduce((sum, entry) => sum + entry.netSalary, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Monthly Payroll</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">View and process monthly payroll for all employees</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {processing ? 'Processing...' : 'Process Payroll'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
            <option value="April 2026">April 2026</option>
            <option value="March 2026">March 2026</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="All">All Status</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Net Salary
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
              {filteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{entry.employeeName}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{entry.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {entry.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(entry.basicSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                    {formatCurrency(entry.earnings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    {formatCurrency(entry.deductions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(entry.netSalary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : entry.status === 'processed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {entry.status === 'pending' && (
                      <button
                        onClick={() => handleApprovePayroll(entry.id)}
                        className="text-[#94cb3d] hover:text-[#7ab52f]"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Earnings</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Deductions</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalDeductions)}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Net Salary</p>
              <p className="text-lg font-bold text-[#94cb3d]">{formatCurrency(totalNetSalary)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
