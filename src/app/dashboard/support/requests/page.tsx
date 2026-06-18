'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Download, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

interface Request {
  id: string;
  subject: string;
  type: 'Information' | 'Service' | 'Complaint' | 'Feedback';
  status: 'Pending' | 'In Review' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  createdBy: string;
  createdAt: string;
}

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const mockRequests: Request[] = [
    { id: 'REQ-001', subject: 'Profile update request', type: 'Service', status: 'Pending', priority: 'Medium', createdBy: 'Alice Smith', createdAt: '2024-01-15' },
    { id: 'REQ-002', subject: 'Attendance correction', type: 'Service', status: 'In Review', priority: 'High', createdBy: 'Bob Johnson', createdAt: '2024-01-15' },
    { id: 'REQ-003', subject: 'Leave balance inquiry', type: 'Information', status: 'Completed', priority: 'Low', createdBy: 'Charlie Brown', createdAt: '2024-01-14' },
    { id: 'REQ-004', subject: 'Payroll deduction query', type: 'Information', status: 'In Review', priority: 'Medium', createdBy: 'Diana Prince', createdAt: '2024-01-14' },
    { id: 'REQ-005', subject: 'System access request', type: 'Service', status: 'Pending', priority: 'High', createdBy: 'Eva Green', createdAt: '2024-01-13' },
    { id: 'REQ-006', subject: 'Mobile app feedback', type: 'Feedback', status: 'Completed', priority: 'Low', createdBy: 'Frank Miller', createdAt: '2024-01-13' },
    { id: 'REQ-007', subject: 'Slow performance complaint', type: 'Complaint', status: 'In Review', priority: 'High', createdBy: 'Grace Hopper', createdAt: '2024-01-12' },
    { id: 'REQ-008', subject: 'Document request', type: 'Service', status: 'Rejected', priority: 'Low', createdBy: 'Henry Ford', createdAt: '2024-01-12' },
  ];

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    'In Review': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    Completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  const typeColors = {
    Information: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    Service: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    Complaint: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    Feedback: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  };

  const priorityColors = {
    Low: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    Medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    High: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesType = typeFilter === 'All' || request.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Employee Requests</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Manage employee service and information requests</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Request
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            >
              <option value="All">All Types</option>
              <option value="Information">Information</option>
              <option value="Service">Service</option>
              <option value="Complaint">Complaint</option>
              <option value="Feedback">Feedback</option>
            </select>
            <Button variant="secondary" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-50">{request.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[request.type]}`}>
                      {request.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[request.priority]}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{request.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{request.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Showing {filteredRequests.length} of {mockRequests.length} requests</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
