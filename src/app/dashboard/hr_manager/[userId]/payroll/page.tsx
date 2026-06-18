'use client';

import { useState } from 'react';
import { Play, Plus, Settings, Download, FileText } from 'lucide-react';
import { useGetAllPayrollRecordsQuery, useGetPayrollSummaryQuery, useProcessPayrollMutation, useApprovePayrollMutation, useMarkAsPaidMutation } from '@/store/services/payslipApi';
import PayrollOverviewWidgets from './components/PayrollOverviewWidgets';
import PayrollFilters from './components/PayrollFilters';
import PayrollTable from './components/PayrollTable';
import SalaryBreakdownModal from './components/SalaryBreakdownModal';
import RunPayrollModal from './components/RunPayrollModal';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salaryStatus, setSalaryStatus] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<any>(null);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

  // Redux API calls
  const { data: payrollData, isLoading } = useGetAllPayrollRecordsQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    page: 1,
    pageSize: 100,
  });

  const { data: summaryData } = useGetPayrollSummaryQuery({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [processPayroll, { isLoading: isProcessing }] = useProcessPayrollMutation();
  const [approvePayroll] = useApprovePayrollMutation();
  const [markAsPaid] = useMarkAsPaidMutation();

  const payrollRecords = payrollData?.data || [];
  const payrollSummary = summaryData?.data || {};

  const handleClearFilters = () => {
    setSearchTerm('');
    setMonthYear('');
    setDepartment('');
    setDesignation('');
    setSalaryStatus('');
    setPaymentMode('');
  };

  const handleViewBreakdown = (id: string) => {
    const record = payrollRecords.find((r: any) => (r._id || r.id) === id);
    if (record) {
      setSelectedPayrollRecord(record);
      setIsBreakdownModalOpen(true);
    }
  };

  const handleEditSalary = (id: string) => {
    alert(`Edit salary for employee ${id}`);
  };

  const handleApprovePayroll = async (id: string) => {
    try {
      await approvePayroll(id).unwrap();
      alert('Payroll approved successfully');
    } catch (error) {
      console.error('Error approving payroll:', error);
      alert('Failed to approve payroll');
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id).unwrap();
      alert('Payroll marked as paid successfully');
    } catch (error) {
      console.error('Error marking payroll as paid:', error);
      alert('Failed to mark payroll as paid');
    }
  };

  const handleDownloadPayslip = (id: string) => {
    console.log(`Download payslip for employee ${id}`);
  };

  const handleRunPayroll = async (data: any) => {
    try {
      await processPayroll(data).unwrap();
      alert('Payroll processed successfully');
      setIsRunPayrollOpen(false);
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Failed to process payroll');
    }
  };

  const handleAddSalaryStructure = () => {
    alert('Opening salary structure form...');
  };

  const handleBulkImportExport = () => {
    alert('Opening bulk import/export dialog...');
  };

  const handlePayrollSettings = () => {
    alert('Opening payroll settings...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Payroll Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage employee salaries and payroll processing</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkImportExport}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Import/Export
          </button>
          <button
            onClick={handlePayrollSettings}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={handleAddSalaryStructure}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Structure
          </button>
          <button
            onClick={() => setIsRunPayrollOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Play className="h-4 w-4" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Payroll Overview Widgets */}
      <PayrollOverviewWidgets summary={payrollSummary} />

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <PayrollFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          monthYear={monthYear}
          onMonthYearChange={setMonthYear}
          department={department}
          onDepartmentChange={setDepartment}
          designation={designation}
          onDesignationChange={setDesignation}
          salaryStatus={salaryStatus}
          onSalaryStatusChange={setSalaryStatus}
          paymentMode={paymentMode}
          onPaymentModeChange={setPaymentMode}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <PayrollTable
          payrollRecords={payrollRecords}
          onViewBreakdown={handleViewBreakdown}
          onEditSalary={handleEditSalary}
          onApprovePayroll={handleApprovePayroll}
          onMarkAsPaid={handleMarkAsPaid}
          onDownloadPayslip={handleDownloadPayslip}
        />
      </div>

      {/* Run Payroll Modal */}
      <RunPayrollModal
        isOpen={isRunPayrollOpen}
        onClose={() => setIsRunPayrollOpen(false)}
        onSubmit={handleRunPayroll}
      />

      {/* Salary Breakdown Modal */}
      <SalaryBreakdownModal
        payrollRecord={selectedPayrollRecord}
        isOpen={isBreakdownModalOpen}
        onClose={() => { setIsBreakdownModalOpen(false); setSelectedPayrollRecord(null); }}
      />
    </div>
  );
}
