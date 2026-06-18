'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setRoles([
        {
          id: '1',
          name: 'Super Admin',
          code: 'super_admin',
          description: 'Full system access with all permissions',
          permissions: ['create', 'read', 'update', 'delete', 'manage'],
          userCount: 2,
          isSystem: true,
          createdAt: '2024-01-01',
        },
        {
          id: '2',
          name: 'Admin',
          code: 'admin',
          description: 'Company-level administration',
          permissions: ['create', 'read', 'update', 'delete'],
          userCount: 15,
          isSystem: true,
          createdAt: '2024-01-01',
        },
        {
          id: '3',
          name: 'Manager',
          code: 'manager',
          description: 'Team management and reporting',
          permissions: ['read', 'update'],
          userCount: 45,
          isSystem: true,
          createdAt: '2024-01-01',
        },
        {
          id: '4',
          name: 'Employee',
          code: 'employee',
          description: 'Basic employee access',
          permissions: ['read'],
          userCount: 1183,
          isSystem: true,
          createdAt: '2024-01-01',
        },
        {
          id: '5',
          name: 'HR Manager',
          code: 'hr_manager',
          description: 'HR-specific permissions',
          permissions: ['create', 'read', 'update'],
          userCount: 8,
          isSystem: false,
          createdAt: '2024-02-15',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading roles...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Roles & Permissions
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage system roles and their permissions
          </p>
        </div>
        <Link
          href="/dashboard/super-admin/roles/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#94cb3d] text-white rounded-md hover:bg-[#7ab52f] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Role
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {role.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                  {role.code}
                </p>
              </div>
              {role.isSystem && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  System
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              {role.description}
            </p>

            <div className="mb-4">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300"
                  >
                    {permission}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {role.userCount} users
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/superadmin/roles/${role.id}`}
                  className="text-sm text-[#94cb3d] hover:text-[#7ab52f]"
                >
                  View
                </Link>
                {!role.isSystem && (
                  <Link
                    href={`/dashboard/superadmin/roles/${role.id}/edit`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 dark:text-zinc-400">No roles found</p>
        </div>
      )}
    </div>
  );
}
