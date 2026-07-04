'use client';

import { useState } from 'react';
import { Check, X, Eye, Search, Calendar, User, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useGetLeaveApprovalsQuery, useApproveLeaveMutation, useRejectLeaveMutation } from '@/store/services/leaveApi';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>([]);

  const { data: pendingLeavesData, isLoading, refetch } = useGetLeaveApprovalsQuery({});
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const pendingLeaves = pendingLeavesData?.data || [];

  const handleApprove = async (leaveId: string) => {
    try {
      await approveLeave({ id: leaveId }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleReject = async (leaveId: string) => {
    try {
      await rejectLeave({ id: leaveId }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const handleViewDetails = (leave: any) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selectedLeaves.map(id => approveLeave({ id }).unwrap()));
      setSelectedLeaves([]);
      refetch();
    } catch (error) {
      console.error('Error bulk approving:', error);
    }
  };

  const handleBulkReject = async () => {
    try {
      await Promise.all(selectedLeaves.map(id => rejectLeave({ id }).unwrap()));
      setSelectedLeaves([]);
      refetch();
    } catch (error) {
      console.error('Error bulk rejecting:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedLeaves.length === pendingLeaves.length) {
      setSelectedLeaves([]);
    } else {
      setSelectedLeaves(pendingLeaves.map((l: any) => l._id || l.id));
    }
  };

  const handleSelectLeave = (id: string) => {
    setSelectedLeaves(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const filteredLeaves = pendingLeaves.filter((leave: any) =>
    leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Leave Approvals</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review and manage employee leave requests</p>
        </div>
        {selectedLeaves.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <Check className="h-4 w-4" />
              Approve All ({selectedLeaves.length})
            </button>
            <button
              onClick={handleBulkReject}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
              Reject All ({selectedLeaves.length})
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending Approvals</p>
              <p className="text-3xl font-bold mt-2">
                {pendingLeaves.filter((l: any) => l.status === 'Pending').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Approved Today</p>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold mt-2">{pendingLeaves.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by employee name, leave type, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          />
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        {isLoading ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            Loading leave requests...
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-2" />
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedLeaves.length === filteredLeaves.length}
                      onChange={handleSelectAll}
                      className="rounded border-zinc-300 text-[#94cb3d] focus:ring-[#94cb3d]"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Leave Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave: any) => {
                  const id = leave._id || leave.id;
                  return (
                    <tr key={id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedLeaves.includes(id)}
                          onChange={() => handleSelectLeave(id)}
                          className="rounded border-zinc-300 text-[#94cb3d] focus:ring-[#94cb3d]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {leave.employeeName ? leave.employeeName.split(' ').map((n: string) => n[0]).join('') : 'NA'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {leave.employeeName || 'Unknown Employee'}
                            </p>
                            <p className="text-xs text-zinc-500">{leave.department || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {leave.leaveType || leave.type || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {leave.fromDate ? new Date(leave.fromDate).toLocaleDateString() : 'N/A'} - {leave.toDate ? new Date(leave.toDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {leave.totalDays ?? 0} days
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
                        <p className="line-clamp-2">{leave.reason || 'No reason provided'}</p>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(leave)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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

      {/* Leave Details Modal */}
      {isModalOpen && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Leave Request Details</h2>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedLeave(null); }}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {selectedLeave.employeeName ? selectedLeave.employeeName.split(' ').map((n: string) => n[0]).join('') : 'NA'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedLeave.employeeName || 'Unknown Employee'}
                  </h3>
                  <p className="text-sm text-zinc-500">{selectedLeave.department || 'N/A'} • {selectedLeave.employeeId || 'N/A'}</p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Leave Type</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedLeave.leaveType || selectedLeave.type || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Status</p>
                  {getStatusBadge(selectedLeave.status)}
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Start Date</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedLeave.fromDate ? new Date(selectedLeave.fromDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">End Date</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedLeave.toDate ? new Date(selectedLeave.toDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Duration</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedLeave.totalDays ?? 0} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Applied On</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(selectedLeave.createdAt || new Date()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-sm text-zinc-500 mb-1">Reason</p>
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {selectedLeave.reason || 'No reason provided'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedLeave(null); }}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-lg"
              >
                Close
              </button>
              {selectedLeave.status === 'Pending' && (
                <>
                  <button
                    onClick={() => { handleReject(selectedLeave._id || selectedLeave.id); setIsModalOpen(false); }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => { handleApprove(selectedLeave._id || selectedLeave.id); setIsModalOpen(false); }}
                    className="px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
