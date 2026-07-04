'use client';

import { useState } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';

interface ApprovalActionsProps {
  request: any;
  onClose: () => void;
  onApprove?: (id: string, remarks?: string) => Promise<void>;
  onReject?: (id: string, reason?: string) => Promise<void>;
}

export default function ApprovalActions({ request, onClose, onApprove, onReject }: ApprovalActionsProps) {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const leaveId = request?._id || request?.id;

  const handleApprove = async () => {
    if (!leaveId || !onApprove) return;
    try {
      setIsProcessing(true);
      await onApprove(leaveId, remarks);
      onClose();
    } catch (error) {
      console.error('Failed to approve leave:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!leaveId || !onReject) return;
    try {
      setIsProcessing(true);
      await onReject(leaveId, remarks);
      onClose();
    } catch (error) {
      console.error('Failed to reject leave:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Remarks (optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks or reason..."
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent min-h-[80px] text-sm"
        />
      </div>

      {/* Approve Button */}
      <button
        onClick={handleApprove}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
      >
        <Check className="h-5 w-5" />
        {isProcessing ? 'Processing...' : 'Approve Leave'}
      </button>

      {/* Reject Button */}
      <button
        onClick={handleReject}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
      >
        <X className="h-5 w-5" />
        {isProcessing ? 'Processing...' : 'Reject Leave'}
      </button>

      <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
        Options: Rejection Reason • Notify Employee
      </div>

      {/* Request Modification */}
      <button
        onClick={() => alert('Requesting modification from employee')}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
      >
        <MessageSquare className="h-5 w-5" />
        Need More Information
      </button>
    </div>
  );
}
