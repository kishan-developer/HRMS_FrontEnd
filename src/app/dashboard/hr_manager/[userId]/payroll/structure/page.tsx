'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import StructureSummaryWidgets from './components/StructureSummaryWidgets';
import StructureFilters from './components/StructureFilters';
import StructureTable from './components/StructureTable';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [salaryType, setSalaryType] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get<any>('/payroll/structures');
        setStructures(res.data?.structures ?? res.data?.items ?? res.data ?? []);
      } catch {
        setStructures([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredStructures = structures.filter((s: any) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || (s.structureName ?? s.name ?? '').toLowerCase().includes(term) || (s.structureCode ?? s.code ?? '').toLowerCase().includes(term);
    const matchDept = !department || s.department === department;
    const matchDesignation = !designation || s.designation === designation;
    const matchSalaryType = !salaryType || s.salaryType === salaryType;
    const matchStatus = !activeStatus || s.status === activeStatus;
    return matchSearch && matchDept && matchDesignation && matchSalaryType && matchStatus;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartment('');
    setDesignation('');
    setSalaryType('');
    setActiveStatus('');
  };

  const handleView = (_id: string) => toast.info('View structure coming soon');
  const handleEdit = (_id: string) => toast.info('Edit structure coming soon');
  const handleAssign = (_id: string) => toast.info('Assign structure coming soon');
  const handleDuplicate = (_id: string) => toast.info('Duplicate structure coming soon');
  const handleDelete = async (id: string) => {
    try { await api.del(`/payroll/structures/${id}`); toast.success('Structure deleted'); setStructures(p => p.filter((s: any) => (s._id ?? s.id) !== id)); } catch {}
  };
  const handleAddStructure = () => toast.info('Create structure coming soon');
  const handleBulkAssign = () => toast.info('Bulk assign coming soon');
  const handleExport = () => toast.info('Export coming soon');

  const handleComponentSettings = () => toast.info('Component settings coming soon');

  if (loading) return <div className="p-6"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Salary Structure</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and configure salary structures</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkAssign}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Bulk Assign
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={handleComponentSettings}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Component Settings
          </button>
          <button
            onClick={handleAddStructure}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Structure
          </button>
        </div>
      </div>

      {/* Structure Summary Widgets */}
      <StructureSummaryWidgets />

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <StructureFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          department={department}
          onDepartmentChange={setDepartment}
          designation={designation}
          onDesignationChange={setDesignation}
          salaryType={salaryType}
          onSalaryTypeChange={setSalaryType}
          activeStatus={activeStatus}
          onActiveStatusChange={setActiveStatus}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Structure Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <StructureTable
          structures={filteredStructures}
          onView={handleView}
          onEdit={handleEdit}
          onAssign={handleAssign}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
