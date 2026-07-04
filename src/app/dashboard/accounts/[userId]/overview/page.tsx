'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { dashboardApi, type AccountsSummary } from '@/services/dashboardApi';
import { StatsCardSkeleton } from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { Wallet, Users, Clock, FileText, AlertCircle, TrendingUp } from 'lucide-react';

export default function AccountsManagerDashboard() {
  const { userId } = useParams();
  const [summary, setSummary] = useState<AccountsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getAccountsSummary();
      if (res.success) setSummary(res.data);
      else setError('Failed to load dashboard data');
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const s = summary;

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        <StatsCardSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return <div className="p-8"><ErrorState message={error} onRetry={fetchSummary} /></div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Accounts Manager Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {s?.currentPayrollMonth ? `Payroll period: ${s.currentPayrollMonth}` : 'Manage payroll, salary processing, reimbursements, and finance reports'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', value: s?.employeeCount ?? 0, color: 'text-zinc-900 dark:text-zinc-50' },
          { label: 'Total Monthly Payroll', value: formatCurrency(s?.totalPayrollAmount ?? 0), color: 'text-zinc-900 dark:text-zinc-50' },
          { label: 'Pending Approvals', value: s?.pendingPayrollApprovals ?? 0, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Pending Reimbursements', value: s?.pendingReimbursements ?? 0, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Generated Payslips', value: s?.generatedPayslips ?? 0, color: 'text-zinc-900 dark:text-zinc-50' },
          { label: 'Salary Exceptions', value: s?.salaryExceptionCount ?? 0, color: 'text-red-600 dark:text-red-400' },
          { label: 'PF Contributions', value: formatCurrency(s?.pfContributions ?? 0), color: 'text-zinc-900 dark:text-zinc-50' },
          { label: 'ESI Contributions', value: formatCurrency(s?.esiContributions ?? 0), color: 'text-zinc-900 dark:text-zinc-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</h3>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { href: `/dashboard/accounts/${userId}/payroll`, icon: <Wallet className="h-5 w-5 text-[#94cb3d]" />, bg: 'bg-[#94cb3d]/10', label: 'Process Payroll', sub: 'Generate monthly payroll' },
              { href: `/dashboard/accounts/${userId}/payslips`, icon: <FileText className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-500/10', label: 'Generate Payslips', sub: 'Create employee payslips' },
              { href: `/dashboard/accounts/${userId}/reimbursements`, icon: <TrendingUp className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-500/10', label: 'Reimbursements', sub: 'Process reimbursements' },
              { href: `/dashboard/accounts/${userId}/loans`, icon: <Users className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-500/10', label: 'Loans & Advances', sub: 'Manage employee loans' },
            ].map(({ href, icon, bg, label, sub }) => (
              <Link key={label} href={href} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>{icon}</div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Payroll Month</h3>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-[#94cb3d]">
              {s?.currentPayrollMonth ? new Date(s.currentPayrollMonth + '-01').toLocaleDateString('en-IN', { month: 'short' }) : '—'}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {s?.currentPayrollMonth ?? 'No active payroll'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Attention Needed</h3>
          <div className="space-y-3">
            {(s?.pendingPayrollApprovals ?? 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Pending Approvals</span>
                </div>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{s?.pendingPayrollApprovals}</span>
              </div>
            )}
            {(s?.pendingReimbursements ?? 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Reimbursements</span>
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{s?.pendingReimbursements}</span>
              </div>
            )}
            {(s?.salaryExceptionCount ?? 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Salary Exceptions</span>
                </div>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">{s?.salaryExceptionCount}</span>
              </div>
            )}
            {(s?.pendingPayrollApprovals ?? 0) === 0 && (s?.pendingReimbursements ?? 0) === 0 && (s?.salaryExceptionCount ?? 0) === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">All caught up!</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Monthly Payroll Trend</h3>
        <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-lg">
          <p className="text-zinc-500 dark:text-zinc-400">Chart placeholder - Monthly payroll trend visualization</p>
        </div>
      </div>
    </div>
  );
}
