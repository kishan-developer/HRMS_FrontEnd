'use client';

import Link from 'next/link';

export default function AccountsManagerDashboard() {
  const stats = {
    totalEmployees: 150,
    totalMonthlyPayroll: 24500000,
    pendingSalaryProcessing: 12,
    pendingReimbursements: 8,
    generatedPayslips: 138,
    payrollCostThisMonth: 24500000,
    pfContributions: 2450000,
    esiContributions: 735000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Accounts Manager Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage payroll, salary processing, reimbursements, and finance reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Employees</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Monthly Payroll</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{formatCurrency(stats.totalMonthlyPayroll)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Salary Processing</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.pendingSalaryProcessing}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending Reimbursements</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.pendingReimbursements}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Generated Payslips</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.generatedPayslips}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Payroll Cost This Month</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{formatCurrency(stats.payrollCostThisMonth)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">PF Contributions</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{formatCurrency(stats.pfContributions)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">ESI Contributions</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{formatCurrency(stats.esiContributions)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/accounts/payroll"
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#94cb3d] bg-opacity-20 flex items-center justify-center">
                <span className="text-[#94cb3d]">💰</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Process Payroll</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Generate monthly payroll</p>
              </div>
            </Link>
            <Link
              href="/dashboard/accounts/payslips"
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <span className="text-blue-500">📄</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Generate Payslips</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Create employee payslips</p>
              </div>
            </Link>
            <Link
              href="/dashboard/accounts/reimbursements"
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 bg-opacity-20 flex items-center justify-center">
                <span className="text-amber-500">💳</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Reimbursements</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Process reimbursements</p>
              </div>
            </Link>
            <Link
              href="/dashboard/accounts/loans"
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
                <span className="text-purple-500">🏦</span>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Loans & Advances</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage employee loans</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Upcoming Salary Date</h3>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-[#94cb3d] dark:text-[#94cb3d]">25</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">June 2026</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">5 days remaining</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">Payroll processed for May 2026</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">138 payslips generated</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
              <div>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">8 reimbursements pending approval</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">PF contribution filed for May</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">1 day ago</p>
              </div>
            </div>
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
