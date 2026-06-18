'use client';

import { useState } from 'react';
import { Search, Filter, AlertTriangle, Download, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

interface TechnicalIssue {
  id: string;
  title: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Reported' | 'Investigating' | 'In Progress' | 'Resolved';
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
}

export default function TechnicalIssuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const mockIssues: TechnicalIssue[] = [
    { id: 'ISS-001', title: 'Server down - payroll system', category: 'Infrastructure', severity: 'Critical', status: 'In Progress', reportedBy: 'Alice Smith', assignedTo: 'John Doe', createdAt: '2024-01-15' },
    { id: 'ISS-002', title: 'Data sync failure across departments', category: 'Database', severity: 'Critical', status: 'Investigating', reportedBy: 'Bob Johnson', assignedTo: 'Jane Smith', createdAt: '2024-01-15' },
    { id: 'ISS-003', title: 'Multiple login failures reported', category: 'Security', severity: 'High', status: 'In Progress', reportedBy: 'Charlie Brown', assignedTo: 'Mike Wilson', createdAt: '2024-01-14' },
    { id: 'ISS-004', title: 'Attendance device malfunction', category: 'Hardware', severity: 'High', status: 'Reported', reportedBy: 'Diana Prince', createdAt: '2024-01-14' },
    { id: 'ISS-005', title: 'Mobile app crash on Android', category: 'Mobile', severity: 'Medium', status: 'Investigating', reportedBy: 'Eva Green', createdAt: '2024-01-13' },
    { id: 'ISS-006', title: 'Slow page load times', category: 'Performance', severity: 'Medium', status: 'In Progress', reportedBy: 'Eva Green', assignedTo: 'Sarah Davis', createdAt: '2024-01-13' },
    { id: 'ISS-007', title: 'Email notification delay', category: 'Communication', severity: 'Low', status: 'Resolved', reportedBy: 'Frank Miller', createdAt: '2024-01-12' },
    { id: 'ISS-008', title: 'API rate limiting errors', category: 'Backend', severity: 'High', status: 'Investigating', reportedBy: 'Grace Hopper', createdAt: '2024-01-12' },
  ];

  const statusColors = {
    Reported: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    Investigating: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'In Progress': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    Resolved: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  };

  const severityColors = {
    Low: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    Medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    High: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    Critical: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Technical Issues
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Track and resolve technical problems</p>
        </div>
        <Button className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Critical Issues Alert */}
      {mockIssues.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-300">
                {mockIssues.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length} Critical Issues Require Immediate Attention
              </p>
            </div>
            <Button variant="danger" size="sm">View Critical</Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search issues..."
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
              <option value="Reported">Reported</option>
              <option value="Investigating">Investigating</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Issue ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{issue.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-50">{issue.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{issue.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityColors[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[issue.status]}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{issue.reportedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{issue.assignedTo || 'Unassigned'}</td>
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Showing {filteredIssues.length} of {mockIssues.length} issues</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
