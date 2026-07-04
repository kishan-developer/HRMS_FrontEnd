'use client';

import { useState } from 'react';
import { Check, X, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { useApproveLeaveMutation, useRejectLeaveMutation } from '@/store/services/leaveApi';

interface LeaveRequestsTableProps {
  selectedStatus: string;
  selectedRequests: string[];
  onSelectionChange: (ids: string[]) => void;
  onRequestClick: (request: any) => void;
  leaveRequests?: any[];
  onRefetch?: () => void;
  isLoading?: boolean;
}

export default function LeaveRequestsTable({
  selectedStatus,
  selectedRequests,
  onSelectionChange,
  onRequestClick,
  leaveRequests = [],
  onRefetch,
  isLoading,
}: LeaveRequestsTableProps) {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const STATUS_MAP: Record<string, string> = {
    all: '',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancel Requested',
  };

  const filteredRequests = selectedStatus === 'all'
    ? leaveRequests
    : leaveRequests.filter(r => r.status === STATUS_MAP[selectedStatus]);

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredRequests.map(r => r._id || r.id));
    }
  };

  const handleSelectRequest = (id: string) => {
    if (selectedRequests.includes(id)) {
      onSelectionChange(selectedRequests.filter(r => r !== id));
    } else {
      onSelectionChange([...selectedRequests, id]);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveLeave({ id }).unwrap();
      onRefetch?.();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectLeave({ id }).unwrap();
      onRefetch?.();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancel requested': return 'bg-purple-100 text-purple-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  const SortIcon = ({ field }: { field: string }) =>
    sortField === field
      ? sortDirection === 'asc'
        ? <ChevronUp className="inline h-4 w-4" />
        : <ChevronDown className="inline h-4 w-4" />
      : null;

  if (isLoading) {
    return <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">Loading leave requests...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredRequests.length} of {leaveRequests.length} requests
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedRequests.length > 0 && selectedRequests.length === filteredRequests.length}
                  onChange={handleSelectAll}
                  className="rounded border-zinc-300 text-[#94cb3d] focus:ring-[#94cb3d]"
                />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => handleSort('employeeId')}>
                Employee <SortIcon field="employeeId" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => handleSort('leaveType')}>
                Leave Type <SortIcon field="leaveType" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Start Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">End Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => handleSort('totalDays')}>
                Days <SortIcon field="totalDays" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => handleSort('createdAt')}>
                Applied On <SortIcon field="createdAt" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer" onClick={() => handleSort('status')}>
                Status <SortIcon field="status" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                  No leave requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => {
                const id = request._id || request.id;
                return (
                  <tr key={id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(id)}
                        onChange={() => handleSelectRequest(id)}
                        className="rounded border-zinc-300 text-[#94cb3d] focus:ring-[#94cb3d]"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 font-medium">{request.employeeName || request.employeeId || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{request.leaveType || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{request.fromDate ? new Date(request.fromDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{request.toDate ? new Date(request.toDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{request.totalDays ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                        {request.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onRequestClick(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
