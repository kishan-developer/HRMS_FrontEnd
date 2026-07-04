'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import EmployeeStatusInsights from './components/EmployeeStatusInsights';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeTable from './components/EmployeeTable';
import EmployeeProfileModal from './components/EmployeeProfileModal';
import EmployeeFormModal from './components/EmployeeFormModal';
import BulkUploadModal from './components/BulkUploadModal';
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useUpdateEmployeeMutation } from '@/store/services/userApi';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  // Redux API call
  const { data: employeesData, isLoading, refetch } = useGetEmployeesQuery({});
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const employees = employeesData?.data || [];

  const mappedEmployees = employees.map((user: any) => ({
    id: user._id || user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
    employeeId: user.employeeId || 'N/A',
    department: user.department || 'N/A',
    designation: user.designation || user.role || 'N/A',
    phone: user.phone || user.mobile || 'N/A',
    email: user.email,
    role: user.role || 'Staff',
    status: user.employeeStatus || (user.isActive !== false ? 'active' : 'inactive'),
    dateOfJoining: user.dateOfJoining || user.createdAt ? new Date(user.dateOfJoining || user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    attendanceSummary: { present: 0, absent: 0, late: 0, totalDays: 0 },
    leaveBalance: { casual: 0, sick: 0, earned: 0 },
  }));

  // Apply filters
  const filteredEmployees = mappedEmployees.filter((employee: any) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        employee.name?.toLowerCase().includes(searchLower) ||
        employee.employeeId?.toLowerCase().includes(searchLower) ||
        employee.email?.toLowerCase().includes(searchLower) ||
        employee.phone?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Department filter (partial match, case-insensitive)
    if (department && !employee.department?.toLowerCase().includes(department.toLowerCase())) {
      return false;
    }

    // Designation filter (partial match, case-insensitive)
    if (designation && !employee.designation?.toLowerCase().includes(designation.toLowerCase())) {
      return false;
    }

    // Employment type filter (partial match, case-insensitive)
    if (employmentType && !employee.employmentType?.toLowerCase().includes(employmentType.toLowerCase())) {
      return false;
    }

    // Role filter (partial match, case-insensitive)
    if (role && !employee.role?.toLowerCase().includes(role.toLowerCase())) {
      return false;
    }

    // Status filter (exact match, case-insensitive)
    if (status && employee.status?.toLowerCase() !== status.toLowerCase()) {
      return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartment('');
    setDesignation('');
    setEmploymentType('');
    setRole('');
    setStatus('');
  };

  const handleView = (id: string) => {
    const employee = filteredEmployees.find((e: any) => e.id === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsProfileModalOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const employee = filteredEmployees.find((e: any) => e.id === id);
    if (employee) {
      setEditingEmployee(employee);
      setIsFormModalOpen(true);
    }
  };

  const handleResetPassword = (id: string) => {
    const employee = filteredEmployees.find((e: any) => e.id === id);
    if (employee) {
      // Password reset would need a dedicated API endpoint
      console.log(`Password reset link sent to ${employee.email}`);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const employee = filteredEmployees.find((e: any) => e.id === id);
    if (employee) {
      try {
        await updateEmployee({ 
          id, 
          isActive: employee.status === 'active' ? false : true 
        }).unwrap();
        refetch();
      } catch (error) {
        console.error('Error updating employee status:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingEmployee) {
        await updateEmployee({ id: editingEmployee.id, ...data }).unwrap();
      } else {
        // Create employee would need a separate mutation
        console.log('Create employee:', data);
      }
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      refetch();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleBulkUpload = async (file: File) => {
    // The upload is now handled by the BulkUploadModal component directly
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Employees</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your workforce</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => { setEditingEmployee(null); setIsFormModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-lg text-sm font-medium hover:bg-[#7ab32e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Status Insights */}
      <EmployeeStatusInsights employees={employees} />

      {/* Filters & Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <EmployeeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          department={department}
          onDepartmentChange={setDepartment}
          designation={designation}
          onDesignationChange={setDesignation}
          employmentType={employmentType}
          onEmploymentTypeChange={setEmploymentType}
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <EmployeeTable
          employees={filteredEmployees}
          onView={handleView}
          onEdit={handleEdit}
          onResetPassword={handleResetPassword}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </div>

      {/* Profile Modal */}
      <EmployeeProfileModal
        employee={selectedEmployee}
        isOpen={isProfileModalOpen}
        onClose={() => { setIsProfileModalOpen(false); setSelectedEmployee(null); }}
      />

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingEmployee(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadComplete={refetch}
      />
    </div>
  );
}
