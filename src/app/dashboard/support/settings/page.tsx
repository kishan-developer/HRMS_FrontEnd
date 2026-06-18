'use client';

import { useState } from 'react';
import { Settings, Save, Plus, Trash2, Edit, Bell, Clock, Shield, Users } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

export default function SupportSettingsPage() {
  const [activeTab, setActiveTab] = useState('categories');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'categories', name: 'Ticket Categories', icon: Settings },
    { id: 'priorities', name: 'Priority Levels', icon: Shield },
    { id: 'sla', name: 'SLA Rules', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'permissions', name: 'Permissions', icon: Users },
  ];

  const categories = [
    { id: 1, name: 'Technical', description: 'Technical issues and bugs', active: true },
    { id: 2, name: 'HR', description: 'HR-related queries', active: true },
    { id: 3, name: 'Payroll', description: 'Payroll and salary issues', active: true },
    { id: 4, name: 'IT', description: 'IT support requests', active: true },
    { id: 5, name: 'General', description: 'General inquiries', active: true },
  ];

  const priorities = [
    { id: 1, name: 'Low', color: '#71717a', responseTime: '24h', active: true },
    { id: 2, name: 'Medium', color: '#3b82f6', responseTime: '12h', active: true },
    { id: 3, name: 'High', color: '#f97316', responseTime: '4h', active: true },
    { id: 4, name: 'Critical', color: '#ef4444', responseTime: '1h', active: true },
  ];

  const slaRules = [
    { id: 1, name: 'First Response', time: '30 minutes', appliesTo: 'All tickets', active: true },
    { id: 2, name: 'Resolution Time', time: '24 hours', appliesTo: 'High priority', active: true },
    { id: 3, name: 'Critical Response', time: '15 minutes', appliesTo: 'Critical priority', active: true },
  ];

  const permissions = [
    { id: 1, name: 'View Tickets', description: 'Can view all tickets', access: true },
    { id: 2, name: 'Create Tickets', description: 'Can create new tickets', access: true },
    { id: 3, name: 'Assign Tickets', description: 'Can assign tickets to agents', access: true },
    { id: 4, name: 'Update Status', description: 'Can update ticket status', access: true },
    { id: 5, name: 'Delete Tickets', description: 'Can delete tickets', access: false },
    { id: 6, name: 'Manage Knowledge Base', description: 'Can create and edit articles', access: true },
    { id: 7, name: 'Send Announcements', description: 'Can create announcements', access: true },
    { id: 8, name: 'Access Reports', description: 'Can view reports', access: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Settings className="h-6 w-6 text-zinc-500" />
            Support Settings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Configure support system settings and preferences</p>
        </div>
        {hasChanges && (
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Ticket Categories</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{category.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${category.active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                      <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'priorities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Priority Levels</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Priority
                </Button>
              </div>
              <div className="space-y-3">
                {priorities.map((priority) => (
                  <div key={priority.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: priority.color }} />
                      <div>
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{priority.name}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Response time: {priority.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">SLA Rules</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-3">
                {slaRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{rule.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Target: {rule.time} • Applies to: {rule.appliesTo}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${rule.active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                      <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Email Notifications</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive email notifications for new tickets</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Push Notifications</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive push notifications on mobile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">SMS Notifications</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive SMS for critical issues</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Support Team Permissions</h2>
              <div className="space-y-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{permission.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{permission.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={permission.access} className="sr-only peer" onChange={() => setHasChanges(true)} />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
