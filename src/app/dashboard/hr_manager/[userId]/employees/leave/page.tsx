'use client';

import { useState } from 'react';
import { Plus, Settings, Download, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllLeavesQuery, useApproveLeaveMutation, useRejectLeaveMutation, useCreateLeaveMutation } from '@/store/services/leaveApi';
import { useGetAllUsersQuery } from '@/store/services/userApi';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import LeaveSummaryWidgets from './components/LeaveSummaryWidgets';
import LeaveFilters from './components/LeaveFilters';
import LeaveRequestsTable from './components/LeaveRequestsTable';
import LeaveRequestDetailsModal from './components/LeaveRequestDetailsModal';
import AddLeaveEntryModal from './components/AddLeaveEntryModal';
import EmployeeLeaveBalancePanel from './components/EmployeeLeaveBalancePanel';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [duration, setDuration] = useState('');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isBalancePanelOpen, setIsBalancePanelOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: leavesRes, isLoading: leavesLoading, refetch } = useGetAllLeavesQuery({
    status: status || undefined,
    leaveType: leaveType || undefined,
  });
  const { data: usersRes } = useGetAllUsersQuery({});
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();
  const [createLeave] = useCreateLeaveMutation();

  const rawLeaves: any[] = leavesRes?.data?.leaves ?? leavesRes?.data?.items ?? leavesRes?.data ?? [];
  const leaveRequests = rawLeaves.filter((r: any) => {
    const name = (r.employeeName ?? r.employee?.name ?? '').toLowerCase();
    const empId = (r.employeeId ?? r.employee?.employeeId ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || name.includes(term) || empId.includes(term);
    const matchDept = !department || (r.department ?? r.employee?.department) === department;
    const matchDesig = !designation || (r.designation ?? r.employee?.designation) === designation;
    return matchSearch && matchDept && matchDesig;
  });

  const rawUsers: any[] = usersRes?.data?.users ?? usersRes?.data?.items ?? usersRes?.data ?? [];
  const employees = rawUsers.map((u: any) => ({
    id: u._id ?? u.id,
    name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
    employeeId: u.employeeId ?? u._id ?? u.id,
  }));


  const handleClearFilters = () => {
    setSearchTerm('');
    setLeaveType('');
    setDepartment('');
    setDesignation('');
    setStatus('');
    setDateRange('');
    setDuration('');
  };

  const handleView = (id: string) => {
    const request = leaveRequests.find((r: any) => (r._id ?? r.id) === id);
    if (request) { setSelectedLeaveRequest(request); setIsDetailsModalOpen(true); }
  };

  const handleEdit = (_id: string) => toast.info('Edit functionality coming soon');

  const handleApprove = async (id: string) => {
    try { await approveLeave({ id }).unwrap(); toast.success('Leave approved'); refetch(); } catch {}
  };

  const handleReject = async (id: string, reason: string) => {
    try { await rejectLeave({ id, reason }).unwrap(); toast.success('Leave rejected'); refetch(); } catch {}
  };

  const handleDelete = (_id: string) => toast.info('Delete functionality coming soon');

  const handleAddEntrySubmit = async (data: any) => {
    try { await createLeave(data).unwrap(); toast.success('Leave entry submitted'); setIsAddEntryOpen(false); refetch(); } catch {}
  };

  const handleExportReport = () => toast.info('Export coming soon');
  const handleUpdatePolicy = () => toast.info('Policy settings coming soon');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Employee Leave Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage all leave requests and balances</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBalancePanelOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Users className="h-4 w-4" />
            View Balances
          </button>
          <button
            onClick={handleUpdatePolicy}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Update Policy
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setIsAddEntryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Leave Entry
          </button>
        </div>
      </div>

      {/* Leave Summary Widgets */}
      <LeaveSummaryWidgets />

      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <LeaveFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            leaveType={leaveType}
            onLeaveTypeChange={setLeaveType}
            department={department}
            onDepartmentChange={setDepartment}
            designation={designation}
            onDesignationChange={setDesignation}
            status={status}
            onStatusChange={setStatus}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            duration={duration}
            onDurationChange={setDuration}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          {leavesLoading ? <LoadingSpinner /> : null}
          <LeaveRequestsTable
            leaveRequests={leaveRequests}
            onView={handleView}
            onEdit={handleEdit}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add Leave Entry Modal */}
      <AddLeaveEntryModal
        isOpen={isAddEntryOpen}
        onClose={() => setIsAddEntryOpen(false)}
        onSubmit={handleAddEntrySubmit}
        employees={employees}
      />

      {/* Leave Request Details Modal */}
      <LeaveRequestDetailsModal
        leaveRequest={selectedLeaveRequest}
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedLeaveRequest(null); }}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Employee Leave Balance Panel */}
      <EmployeeLeaveBalancePanel
        isOpen={isBalancePanelOpen}
        onClose={() => setIsBalancePanelOpen(false)}
        employeeBalances={[]}
      />
    </div>
  );
}
