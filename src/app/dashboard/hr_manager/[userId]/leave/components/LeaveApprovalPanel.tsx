'use client';

import { useState } from 'react';
import { X, Check, XCircle, MessageSquare, FileText, Calendar, User } from 'lucide-react';
import { useApproveLeaveMutation, useRejectLeaveMutation } from '@/store/services/leaveApi';

interface LeaveApprovalPanelProps {
  leaveRequest: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveApprovalPanel({ leaveRequest, isOpen, onClose }: LeaveApprovalPanelProps) {
  const [remarks, setRemarks] = useState('');
  const [approveLeave, { isLoading: isApproving }] = useApproveLeaveMutation();
  const [rejectLeave, { isLoading: isRejecting }] = useRejectLeaveMutation();

  if (!isOpen) return null;

  const leaveId = leaveRequest?._id || leaveRequest?.id;

  const handleApprove = async () => {
    if (!leaveId) return;
    try {
      await approveLeave({ id: leaveId, managerNotes: remarks }).unwrap();
      setRemarks('');
      onClose();
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleReject = async () => {
    if (!leaveId) return;
    try {
      await rejectLeave({ id: leaveId, rejectionReason: remarks, managerNotes: remarks }).unwrap();
      setRemarks('');
      onClose();
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  };

  const handleRequestInfo = () => {
    alert('Requesting more information from employee');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl h-full overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Leave Request Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Details */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#94cb3d]" />
              Employee Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Employee ID</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.employeeId || leaveRequest?.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Name</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.employeeName || leaveRequest?.employee || leaveRequest?.employeeId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Department</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Designation</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Senior Executive</p>
              </div>
            </div>
          </div>

          {/* Leave Information */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Leave Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Leave Type</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.leaveType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Days</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.totalDays || leaveRequest?.days || 'N/A'} days</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Start Date</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.fromDate ? new Date(leaveRequest.fromDate).toLocaleDateString() : (leaveRequest?.startDate || 'N/A')}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">End Date</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.toDate ? new Date(leaveRequest.toDate).toLocaleDateString() : (leaveRequest?.endDate || 'N/A')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Reason</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{leaveRequest?.reason || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Attachments
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">Medical Certificate.pdf</span>
                </div>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab32e]">View</button>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">Supporting Documents.pdf</span>
                </div>
                <button className="text-sm text-[#94cb3d] hover:text-[#7ab32e]">View</button>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Remarks
            </h3>
            <textarea
              placeholder="Add remarks for this leave request..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              <Check className="h-5 w-5" />
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              <XCircle className="h-5 w-5" />
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              onClick={handleRequestInfo}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Request Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
