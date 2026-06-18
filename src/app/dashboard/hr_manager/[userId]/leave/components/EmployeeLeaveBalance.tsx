'use client';

import { RefreshCw, History } from 'lucide-react';

interface EmployeeLeaveBalanceProps {
  leaveTypes?: any[];
  employeeBalances?: any[];
}

export default function EmployeeLeaveBalance({ leaveTypes = [], employeeBalances = [] }: EmployeeLeaveBalanceProps) {
  // Get leave type names from API data, or use defaults
  const leaveTypeNames = leaveTypes.length > 0
    ? leaveTypes.map((t: any) => t.name)
    : ['Casual Leave', 'Sick Leave', 'Earned Leave'];

  const handleAdjustBalance = (employeeId: number) => {
    alert(`Adjusting balance for employee ${employeeId}`);
  };

  const handleResetBalance = (employeeId: number) => {
    alert(`Resetting balance for employee ${employeeId}`);
  };

  const handleViewHistory = (employeeId: number) => {
    alert(`Viewing history for employee ${employeeId}`);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Employee Leave Balance</h2>
      {employeeBalances.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          No employee balance data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Employee</th>
                {leaveTypeNames.slice(0, 3).map((name: string, index: number) => (
                  <th key={index} className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {name}
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Used</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Remaining</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeBalances.map((balance: any) => {
                const id = balance._id || balance.id;
                return (
                  <tr key={id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                      {balance.employeeName || balance.employee || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {balance.casual || balance.casualLeave || balance.balances?.casual || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {balance.sick || balance.sickLeave || balance.balances?.sick || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {balance.earned || balance.earnedLeave || balance.balances?.earned || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {balance.used || balance.totalUsed || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-[#94cb3d]">
                        {balance.remaining || balance.totalRemaining || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAdjustBalance(id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Adjust Balance"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResetBalance(id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title="Reset Balance"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewHistory(id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="View History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
