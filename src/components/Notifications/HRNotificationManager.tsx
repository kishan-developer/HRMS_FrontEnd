'use client';

import { useState } from 'react';
import { Bell, Plus, Search, Filter, Calendar, Clock, Mail, Smartphone, MessageSquare, Check, Eye, Trash2, RefreshCw, Settings, FileText, Send } from 'lucide-react';

interface HRNotificationManagerProps {
  userId: string;
}

type TabType = 'all' | 'create' | 'scheduled' | 'templates' | 'settings';

type NotificationType = 'General' | 'Attendance' | 'Leave' | 'Payroll' | 'Holiday' | 'Policy' | 'Meeting' | 'Birthday' | 'Document' | 'Emergency';
type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
type Status = 'Draft' | 'Scheduled' | 'Sent' | 'Failed' | 'Cancelled';
type Channel = 'In-App' | 'Mobile' | 'Email' | 'SMS' | 'WhatsApp';
type AudienceType = 'All Employees' | 'Department' | 'Branch' | 'Role' | 'Specific Employees' | 'Employees on Leave' | 'Late Employees Today' | 'Employees with Missing Punch' | 'New Joiners';

interface Notification {
  _id: string;
  title: string;
  type: NotificationType;
  audience: string;
  priority: Priority;
  channels: Channel[];
  status: Status;
  sentDate: string;
  readCount: number;
  totalRecipients: number;
}

export default function HRNotificationManager({ userId }: HRNotificationManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Mock data
  const stats = {
    total: 124,
    sentToday: 8,
    unread: 36,
    scheduled: 5,
  };

  const notifications: Notification[] = [
    {
      _id: '1',
      title: 'Salary Credited',
      type: 'Payroll',
      audience: 'All Employees',
      priority: 'High',
      channels: ['Mobile', 'Email'],
      status: 'Sent',
      sentDate: '2026-07-02',
      readCount: 78,
      totalRecipients: 120,
    },
    {
      _id: '2',
      title: 'Holiday Announcement',
      type: 'Holiday',
      audience: 'All Employees',
      priority: 'Medium',
      channels: ['In-App', 'Email'],
      status: 'Sent',
      sentDate: '2026-07-01',
      readCount: 95,
      totalRecipients: 120,
    },
    {
      _id: '3',
      title: 'Missing Punch Alert',
      type: 'Attendance',
      audience: 'Employees with Missing Punch',
      priority: 'High',
      channels: ['Mobile', 'Email'],
      status: 'Sent',
      sentDate: '2026-07-02',
      readCount: 12,
      totalRecipients: 15,
    },
    {
      _id: '4',
      title: 'Policy Update',
      type: 'Policy',
      audience: 'All Employees',
      priority: 'High',
      channels: ['In-App', 'Email'],
      status: 'Scheduled',
      sentDate: '2026-07-05',
      readCount: 0,
      totalRecipients: 120,
    },
    {
      _id: '5',
      title: 'Meeting Reminder',
      type: 'Meeting',
      audience: 'Department: HR',
      priority: 'Medium',
      channels: ['In-App', 'Mobile'],
      status: 'Draft',
      sentDate: '',
      readCount: 0,
      totalRecipients: 8,
    },
  ];

  const templates = [
    { id: '1', name: 'Attendance Reminder', description: 'Remind employees to check in or check out', usage: 45 },
    { id: '2', name: 'Leave Approval', description: 'Notify employee about leave approval', usage: 32 },
    { id: '3', name: 'Leave Rejection', description: 'Notify employee about leave rejection', usage: 18 },
    { id: '4', name: 'Salary Credited', description: 'Announce salary credit', usage: 12 },
    { id: '5', name: 'Holiday Announcement', description: 'Announce company holidays', usage: 28 },
    { id: '6', name: 'Policy Update', description: 'Notify about policy changes', usage: 15 },
    { id: '7', name: 'Document Submission Reminder', description: 'Remind to submit documents', usage: 22 },
    { id: '8', name: 'Meeting Reminder', description: 'Remind about upcoming meetings', usage: 35 },
    { id: '9', name: 'Birthday Wish', description: 'Send birthday wishes', usage: 8 },
    { id: '10', name: 'Missing Punch Alert', description: 'Alert about missing punches', usage: 25 },
  ];

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Low': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'Medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Urgent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Draft': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      case 'Scheduled': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Sent': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Cancelled': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'In-App': return <Bell className="h-4 w-4" />;
      case 'Mobile': return <Smartphone className="h-4 w-4" />;
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'WhatsApp': return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleViewDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage company-wide alerts, HR announcements, reminders, and employee updates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#94cb3d] text-white hover:bg-[#7eb32e] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Notifications</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Sent Today</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{stats.sentToday}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Unread</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{stats.unread}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Scheduled</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{stats.scheduled}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex gap-8">
          {[
            { id: 'all' as TabType, label: 'All Notifications' },
            { id: 'create' as TabType, label: 'Create Notification' },
            { id: 'scheduled' as TabType, label: 'Scheduled' },
            { id: 'templates' as TabType, label: 'Templates' },
            { id: 'settings' as TabType, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#94cb3d] text-[#94cb3d]'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent"
                  />
                </div>
              </div>
              <select className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
                <option value="">All Types</option>
                <option>General</option>
                <option>Attendance</option>
                <option>Leave</option>
                <option>Payroll</option>
                <option>Holiday</option>
                <option>Policy</option>
                <option>Meeting</option>
                <option>Birthday</option>
                <option>Document</option>
                <option>Emergency</option>
              </select>
              <select className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
                <option value="">All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
              <select className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
                <option value="">All Status</option>
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Sent</option>
                <option>Failed</option>
                <option>Cancelled</option>
              </select>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Notifications Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Audience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Sent Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Read Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {notifications.map((notification) => (
                    <tr key={notification._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{notification.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{notification.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{notification.audience}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {notification.channels.map((channel) => (
                            <span key={channel} className="text-zinc-600 dark:text-zinc-400" title={channel}>
                              {getChannelIcon(channel)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{notification.sentDate || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {notification.readCount}/{notification.totalRecipients} Read
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDetail(notification)}
                            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Resend"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Create New Notification</h2>
          <CreateNotificationForm onCancel={() => setActiveTab('all')} />
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Scheduled Notifications</h2>
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
            <p>No scheduled notifications</p>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Notification Templates</h2>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-[#94cb3d] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Used {template.usage} times</span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{template.name}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">{template.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-[#94cb3d] text-white hover:bg-[#7eb32e] transition-colors"
                  >
                    Use Template
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Notification Settings</h2>
          <NotificationSettings />
        </div>
      )}

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

// Create Notification Form Component
function CreateNotificationForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Notification Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent"
            placeholder="Enter notification title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Notification Type</label>
          <select className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
            <option>General</option>
            <option>Attendance</option>
            <option>Leave</option>
            <option>Payroll</option>
            <option>Holiday</option>
            <option>Policy</option>
            <option>Meeting</option>
            <option>Birthday</option>
            <option>Document</option>
            <option>Emergency</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Message</label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent"
          placeholder="Enter your message"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Priority</label>
          <select className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Audience Type</label>
          <select className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#94cb3d] focus:border-transparent">
            <option>All Employees</option>
            <option>Department</option>
            <option>Branch</option>
            <option>Role</option>
            <option>Specific Employees</option>
            <option>Employees on Leave</option>
            <option>Late Employees Today</option>
            <option>Employees with Missing Punch</option>
            <option>New Joiners</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Channels</label>
        <div className="flex flex-wrap gap-4">
          {['In-App', 'Mobile', 'Email', 'SMS', 'WhatsApp'].map((channel) => (
            <label key={channel} className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-zinc-300 text-[#94cb3d] focus:ring-[#94cb3d]" />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{channel}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Schedule</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="schedule" className="text-[#94cb3d] focus:ring-[#94cb3d]" defaultChecked />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Send Now</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="schedule" className="text-[#94cb3d] focus:ring-[#94cb3d]" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Schedule Later</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="schedule" className="text-[#94cb3d] focus:ring-[#94cb3d]" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Save as Draft</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[#94cb3d] text-white hover:bg-[#7eb32e] transition-colors"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Attendance Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Check-in Reminder', enabled: true, time: '09:30 AM' },
            { label: 'Check-out Reminder', enabled: true, time: '06:30 PM' },
            { label: 'Late Arrival Alert', enabled: true },
            { label: 'Missing Punch Alert', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{setting.label}</p>
                {setting.time && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{setting.time}</p>}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#94cb3d]" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Leave Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Leave Request Submitted', enabled: true },
            { label: 'Leave Approved', enabled: true },
            { label: 'Leave Rejected', enabled: true },
            { label: 'Leave Balance Updated', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{setting.label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#94cb3d]" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Payroll Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Payslip Generated', enabled: true },
            { label: 'Salary Credited', enabled: true },
            { label: 'Reimbursement Approved', enabled: true },
            { label: 'Loan EMI Deducted', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{setting.label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#94cb3d]" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">HR Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'New Policy Uploaded', enabled: true },
            { label: 'Document Verification Pending', enabled: true },
            { label: 'Birthday Notification', enabled: true },
            { label: 'Work Anniversary', enabled: true },
            { label: 'Holiday Announcement', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{setting.label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#94cb3d]" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notification Detail Modal Component
function NotificationDetailModal({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{notification.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Type</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mt-1">{notification.type}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mt-1">{notification.priority}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Audience</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mt-1">{notification.audience}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mt-1">{notification.status}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Your June salary has been credited. Please check your payslip.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Read Status</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mt-1">{notification.readCount}/{notification.totalRecipients} Read</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Failed Delivery</p>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">2 Employees</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Create Notification Modal Component
function CreateNotificationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create Notification</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <CreateNotificationForm onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
