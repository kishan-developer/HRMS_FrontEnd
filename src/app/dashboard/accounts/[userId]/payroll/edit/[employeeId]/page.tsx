'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useGetPayrollByEmployeeQuery } from '@/store/services/payslipApi';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingState';

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

export default function EmployeePayrollEdit() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId as string;

  const [payrollData, setPayrollData] = useState<Partial<PayrollEntry>>({});
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const { data: res, isLoading } = useGetPayrollByEmployeeQuery(
    { employeeId, month: now.getMonth() + 1, year: now.getFullYear() },
    { skip: !employeeId }
  );

  useEffect(() => {
    const raw = res?.data ?? res;
    if (raw) {
      setPayrollData({
        id: raw._id ?? raw.id ?? employeeId,
        employeeId: raw.employeeId ?? employeeId,
        name: raw.employeeName ?? raw.name ?? 'Employee',
        department: raw.department ?? '',
        basicSalary: raw.basicSalary ?? raw.grossSalary ?? 0,
        deductions: raw.totalDeductions ?? raw.deductions ?? 0,
        netSalary: raw.netSalary ?? 0,
        status: raw.status ?? 'pending',
      });
    }
  }, [res, employeeId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/payroll/${payrollData.id}`, payrollData);
      toast.success('Payroll updated successfully');
      router.back();
    } catch {
      toast.error('Failed to save payroll changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCalculate = () => {
    if (payrollData.basicSalary && payrollData.deductions) {
      setPayrollData({
        ...payrollData,
        netSalary: payrollData.basicSalary - payrollData.deductions,
      });
    }
  };

  if (isLoading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!payrollData.id) return <div className="p-8 text-zinc-500">No payroll data found.</div>;

  return (
    <div className="p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#94cb3d] hover:text-[#7ab52f] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Payroll
      </button>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Edit Payroll Entry</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employee Name</label>
            <input
              type="text"
              value={payrollData.name || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employee ID</label>
            <input
              type="text"
              value={payrollData.employeeId || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Department</label>
            <input
              type="text"
              value={payrollData.department || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Basic Salary</label>
            <input
              type="number"
              value={payrollData.basicSalary || ''}
              onChange={(e) => setPayrollData({ ...payrollData, basicSalary: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Deductions</label>
            <input
              type="number"
              value={payrollData.deductions || ''}
              onChange={(e) => setPayrollData({ ...payrollData, deductions: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            />
          </div>
          
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Calculate Net Salary
          </button>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Net Salary</label>
            <p className="text-2xl font-bold text-[#94cb3d]">
              {payrollData.netSalary ? formatCurrency(payrollData.netSalary) : 'Not calculated'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
            <select
              value={payrollData.status}
              onChange={(e) => setPayrollData({ ...payrollData, status: e.target.value as 'pending' | 'processed' | 'approved' })}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
