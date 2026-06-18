'use client';

import { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle, Hourglass, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetMyLeaveRequestsQuery, useGetLeaveBalanceQuery, useCreateLeaveMutation, useCancelLeaveMutation } from '@/store/services/leaveApi';
import { useGetUserQuery } from '@/store/services/userApi';

interface LeaveBalance {
  CL: number;
  PL: number;
}

interface LeaveRequest {
  _id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: string;
  createdAt: string;
}

export default function EmployeeLeave() {
  const params = useParams();
  const userId = params.userId as string;

  // Redux API calls - optimized for fast response
  const { data: userData, isLoading: userLoading } = useGetUserQuery(userId, { skip: !userId });
  const { data: leaves, isLoading: leavesLoading, refetch: refetchLeaves } = useGetMyLeaveRequestsQuery({});
  const { data: leaveBalanceData, isLoading: balanceLoading } = useGetLeaveBalanceQuery(userId, { skip: !userId });
  
  // Mutations
  const [createLeave, { isLoading: creatingLeave }] = useCreateLeaveMutation();
  const [cancelLeave, { isLoading: cancellingLeave }] = useCancelLeaveMutation();

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  // Only wait for leaves and balance to load, user data can load in background
  const loading = leavesLoading || balanceLoading;
  const submitting = creatingLeave || cancellingLeave;

  // Calculate leave balance from API response
  const leaveBalance = {
    CL: leaveBalanceData?.data?.casualLeave || leaveBalanceData?.data?.CL || 12,
    PL: leaveBalanceData?.data?.earnedLeave || leaveBalanceData?.data?.PL || 15,
    SL: leaveBalanceData?.data?.sickLeave || leaveBalanceData?.data?.SL || 6,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting leave request:', formData);

    try {
      const result = await createLeave({
        employeeId: userId, // Use userId directly instead of waiting for userData
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
      }).unwrap();

      console.log('Leave request result:', result);

      if (result.success) {
        setShowApplyForm(false);
        setFormData({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '' });
        refetchLeaves();
        alert('Leave request submitted successfully!');
      }
    } catch (error: any) {
      console.error('Leave request error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to submit leave request';
      alert(errorMessage);
    }
  };

  const handleCancelLeave = async (leaveId: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      await cancelLeave(leaveId).unwrap();
      refetchLeaves();
    } catch (error: any) {
      alert(error.message || 'Failed to cancel leave request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading leaves...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Leave Management</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Apply and view your leave requests</p>
        </div>
        <button 
          onClick={() => setShowApplyForm(!showApplyForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg hover:bg-[#7ab52f] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">CL Balance</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{leaveBalance.CL}</p>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <p>• Used for personal work, emergencies, short leave</p>
            <p>• 6–12 days per year</p>
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">PL Balance</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{leaveBalance.PL}</p>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <p>• Earned based on working days</p>
            <p>• Can be carried forward to next year</p>
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">SL Balance</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{leaveBalance.SL}</p>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <p>• Used for medical reasons</p>
            <p>• Requires medical certificate</p>
          </div>
        </div>
      </div>

      {showApplyForm && (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Apply for Leave</h2>
            <button 
              onClick={() => setShowApplyForm(false)}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Leave Type
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="Casual Leave">Casual Leave (CL)</option>
                <option value="Earned Leave">Earned Leave (PL)</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Leave History</h2>
        <div className="space-y-4">
          {leaves?.data?.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">No leave requests found</p>
          ) : (
            leaves?.data?.map((leave: any) => (
              <div key={leave._id} className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    leave.status === 'Approved' ? 'bg-green-100 dark:bg-green-900/30' :
                    leave.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/30' :
                    leave.status === 'Cancel Requested' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {leave.status === 'Approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : leave.status === 'Rejected' ? (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : leave.status === 'Cancel Requested' ? (
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Hourglass className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{leave.leaveType} - {leave.totalDays} day(s)</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{leave.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    leave.status === 'Approved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : leave.status === 'Rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : leave.status === 'Cancel Requested'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {leave.status}
                  </span>
                  {(leave.status === 'Pending' || leave.status === 'Approved') && (
                    <button
                      onClick={() => handleCancelLeave(leave._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
