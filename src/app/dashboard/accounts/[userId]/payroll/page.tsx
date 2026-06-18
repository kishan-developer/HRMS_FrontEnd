'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface PayrollEntry {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  basicSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'approved';
}

export default function PayrollManagement() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [selectedMonth, setSelectedMonth] = useState('June 2026');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'John Smith',
      department: 'Engineering',
      basicSalary: 80000,
      deductions: 12000,
      netSalary: 68000,
      status: 'processed',
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Sarah Johnson',
      department: 'HR',
      basicSalary: 65000,
      deductions: 9750,
      netSalary: 55250,
      status: 'processed',
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Mike Brown',
      department: 'Sales',
      basicSalary: 75000,
      deductions: 11250,
      netSalary: 63750,
      status: 'pending',
    },
    {
      id: '4',
      employeeId: 'EMP004',
      name: 'Emily Davis',
      department: 'Engineering',
      basicSalary: 90000,
      deductions: 13500,
      netSalary: 76500,
      status: 'processed',
    },
    {
      id: '5',
      employeeId: 'EMP005',
      name: 'David Wilson',
      department: 'Finance',
      basicSalary: 70000,
      deductions: 10500,
      netSalary: 59500,
      status: 'pending',
    },
  ]);
  const [processing, setProcessing] = useState(false);

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

  const handleCalculateSalary = (id: string) => {
    const employee = payrollData.find(e => e.id === id);
    if (employee) {
      const netSalary = employee.basicSalary - employee.deductions;
      setPayrollData(payrollData.map(e => 
        e.id === id ? { ...e, netSalary } : e
      ));
    }
  };

  const handleApprovePayroll = (id: string) => {
    setPayrollData(payrollData.map(entry => 
      entry.id === id ? { ...entry, status: 'approved' as const } : entry
    ));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Payroll Management
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Process and manage monthly payroll for all employees
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleProcessPayroll}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" />
            Process Payroll
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
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
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
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
              {payrollData.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{entry.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{entry.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                    {entry.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(entry.basicSalary)}
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
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/accounts/${userId}/payroll/view/${entry.id}`}
                        className="text-[#94cb3d] hover:text-[#7ab52f]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/accounts/${userId}/payroll/edit/${entry.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleCalculateSalary(entry.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Calculate
                      </button>
                      {entry.status !== 'approved' && (
                        <button 
                          onClick={() => handleApprovePayroll(entry.id)}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          Approve
                        </button>
                      )}
                      <Link
                        href={`/dashboard/accounts/${userId}/payroll/payslip/${entry.id}`}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Payslip
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
