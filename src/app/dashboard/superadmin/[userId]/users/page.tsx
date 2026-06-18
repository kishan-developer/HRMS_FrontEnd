'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { Plus } from 'lucide-react';
import EmployeeFormModal from './components/EmployeeFormModal';

interface User {
  _id: string;
  email: string;
  employeeId?: string;
  role: 'superadmin' | 'hr_manager' | 'accounts' | 'employee' | 'support';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  employeeDetails?: {
    firstName?: string;
    lastName?: string;
    department?: string;
    company?: string;
  };
}

export default function UsersList() {
  const params = useParams();
  const userId = params.userId as string;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const handleToggleStatus = (user: User) => {
    setUserToBlock(user);
    setBlockConfirmOpen(true);
  };

  const confirmBlock = async () => {
    if (!userToBlock) return;
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userToBlock._id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Refresh users list
        const response = await fetch(`${BACKEND_URL}/api/v1/users?status=${filterStatus}&role=${filterRole}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setBlockConfirmOpen(false);
      setUserToBlock(null);
    }
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // Refresh users list
        const response = await fetch(`${BACKEND_URL}/api/v1/users?status=${filterStatus}&role=${filterRole}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!selectedUser) return;
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: updatedData.email,
          employeeId: updatedData.employeeId,
          role: updatedData.role,
          isActive: updatedData.isActive,
          company: updatedData.employeeDetails?.company,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh users list
        const response = await fetch(`${BACKEND_URL}/api/v1/users?status=${filterStatus}&role=${filterRole}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
        setEditModalOpen(false);
      } else {
        console.error('Failed to update user:', data.message);
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    // Prevent updating to superadmin
    if (newRole === 'superadmin') {
      setToast({ message: 'You are not able to update superadmin role', type: 'error' });
      setRoleDropdownOpen(null);
      setDropdownPosition(null);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh users list
        const response = await fetch(`${BACKEND_URL}/api/v1/users?status=${filterStatus}&role=${filterRole}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
        setToast({ message: 'Role updated successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      } else {
        console.error('Failed to update role:', data.message);
        setToast({ message: 'Failed to update role', type: 'error' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setToast({ message: 'Failed to update role', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setRoleDropdownOpen(null);
      setDropdownPosition(null);
    }
  };

  const handleDropdownToggle = (event: React.MouseEvent, user: User) => {
    event.stopPropagation();
    if (roleDropdownOpen === user._id) {
      setRoleDropdownOpen(null);
      setDropdownPosition(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const dropdownHeight = 200; // Approximate dropdown height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: showAbove ? rect.top + window.scrollY - dropdownHeight : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setRoleDropdownOpen(user._id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const token = getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Map form data to API format
      const apiData = {
        employeeId: data.employeeId,
        email: data.email,
        password: data.password,
        role: data.role,
        companyId: '',
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
        designation: data.designation,
      };

      const response = await fetch(`${BACKEND_URL}/api/v1/users/dashboard/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (result.success) {
        setToast({ message: 'Employee created successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
        setIsFormModalOpen(false);
        setEditingEmployee(null);
        
        // Refresh users list
        const response = await fetch(`${BACKEND_URL}/api/v1/users?status=${filterStatus}&role=${filterRole}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users || []);
        }
      } else {
        setToast({ message: 'Failed to create employee: ' + result.message, type: 'error' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setToast({ message: 'Failed to create employee', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setUsers(data.data.users || []);
        } else {
          console.error('Failed to fetch users:', data.message);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filterStatus, filterRole, searchTerm]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'hr_manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accounts':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'support':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'employee':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg ${
          toast.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Users
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage all system users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/superadmin/${userId}/users/create`}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Add
          </Link>
          <button
            onClick={() => { setEditingEmployee(null); setIsFormModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="hr_manager">HR Manager</option>
            <option value="accounts">Accounts</option>
            <option value="employee">Employee</option>
            <option value="support">Support</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {users.map((user: User) => (
              <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {user.employeeDetails?.firstName && user.employeeDetails?.lastName
                        ? `${user.employeeDetails.firstName} ${user.employeeDetails.lastName}`
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-zinc-900 dark:text-zinc-50 font-mono">
                    {user.employeeId || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-50">
                  {user.employeeDetails?.company || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <div className="relative">
                    <button
                      onClick={(e) => handleDropdownToggle(e, user)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {roleDropdownOpen === user._id && dropdownPosition && (
                      <div 
                        className="fixed z-[100] w-40 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                      >
                        <div className="py-1">
                          {['superadmin', 'hr_manager', 'accounts', 'employee', 'support'].map((role) => (
                            <button
                              key={role}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleChange(user, role);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm whitespace-nowrap ${
                                role === user.role
                                  ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50'
                                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                              }`}
                            >
                              {role.replace('_', ' ').toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="text-[#94cb3d] hover:text-[#7ab52f] mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`${user.isActive ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300' : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'} mr-2`}
                  >
                    {user.isActive ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">No users found</p>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                User Details
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl sm:text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Name
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                    {selectedUser.employeeDetails?.firstName && selectedUser.employeeDetails?.lastName
                      ? `${selectedUser.employeeDetails.firstName} ${selectedUser.employeeDetails.lastName}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50 break-all">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Employee ID
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">{selectedUser.employeeId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Role
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50 capitalize">{selectedUser.role.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Company
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">{selectedUser.employeeDetails?.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Department
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">{selectedUser.employeeDetails?.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Last Login
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Created At
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Updated At
                  </label>
                  <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-50">
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Edit User
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl sm:text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(selectedUser);
              }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-sm sm:text-base text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Employee ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedUser.employeeId || ''}
                      onChange={(e) => setSelectedUser({ ...selectedUser, employeeId: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-sm sm:text-base text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedUser({ ...selectedUser, employeeId: `EMP${Date.now()}` })}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      title="Auto-generate Employee ID"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={selectedUser.employeeDetails?.company || ''}
                    onChange={(e) => setSelectedUser({ 
                      ...selectedUser, 
                      employeeDetails: { ...selectedUser.employeeDetails, company: e.target.value }
                    })}
                    className="w-full px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-sm sm:text-base text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Role
                  </label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as User['role'] })}
                    className="w-full px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-sm sm:text-base text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="accounts">Accounts</option>
                    <option value="employee">Employee</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedUser.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.value === 'active' })}
                    className="w-full px-3 sm:px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-sm sm:text-base text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockConfirmOpen && userToBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {userToBlock.isActive ? 'Block User' : 'Unblock User'}
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Are you sure you want to {userToBlock.isActive ? 'block' : 'unblock'} user {userToBlock.email}?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setBlockConfirmOpen(false);
                  setUserToBlock(null);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                {userToBlock.isActive ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Delete User
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Are you sure you want to delete user {userToDelete.email}? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingEmployee(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />
    </div>
  );
}
