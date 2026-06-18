'use client';

import { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, FileText, TrendingUp, Clock, Star, Users, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('ticket');
  const [dateRange, setDateRange] = useState<string>('30d');

  const reports = [
    { id: 'ticket', name: 'Ticket Report', icon: FileText, description: 'Comprehensive ticket analysis and trends' },
    { id: 'resolution', name: 'Resolution Report', icon: CheckCircle, description: 'Ticket resolution time and rates' },
    { id: 'performance', name: 'Agent Performance', icon: TrendingUp, description: 'Individual and team performance metrics' },
    { id: 'response', name: 'Response Time Report', icon: Clock, description: 'Response time analysis by category' },
    { id: 'satisfaction', name: 'Satisfaction Report', icon: Star, description: 'Customer satisfaction scores and feedback' },
    { id: 'category', name: 'Category Report', icon: BarChart3, description: 'Issue breakdown by category' },
    { id: 'monthly', name: 'Monthly Summary', icon: Calendar, description: 'Monthly support activity summary' },
    { id: 'employee', name: 'Employee Report', icon: Users, description: 'Employee-specific support interactions' },
  ];

  const reportData = {
    ticket: {
      total: 269,
      resolved: 156,
      pending: 87,
      closed: 26,
      avgResolution: '24h',
      satisfaction: '4.8/5',
    },
    resolution: {
      avgTime: '18.5h',
      slaMet: '92%',
      withinSLA: 247,
      beyondSLA: 22,
    },
    performance: {
      topAgent: 'Sarah Johnson',
      topAgentTickets: 45,
      teamAvg: 32,
      satisfaction: 4.8,
    },
  };

  const currentReportData = reportData[selectedReport as keyof typeof reportData];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-500" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">View and export support performance reports</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${selectedReport === report.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <h3 className={`text-sm font-medium ${selectedReport === report.id ? 'text-blue-900 dark:text-blue-300' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {report.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {reports.find(r => r.id === selectedReport)?.name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {dateRange === 'custom' ? 'Custom date range' : `Last ${dateRange.replace('d', ' days')}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">PDF</Button>
            <Button variant="secondary" size="sm">Excel</Button>
            <Button variant="secondary" size="sm">CSV</Button>
            <Button variant="secondary" size="sm">Print</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {selectedReport === 'ticket' && (
            <>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Tickets</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">269</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">156</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">87</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Closed</p>
                <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400">26</p>
              </div>
            </>
          )}
          {selectedReport === 'resolution' && (
            <>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">18.5h</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">SLA Met</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">92%</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Within SLA</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">247</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Beyond SLA</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">22</p>
              </div>
            </>
          )}
          {selectedReport === 'performance' && (
            <>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Top Agent</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Sarah Johnson</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Tickets Handled</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">45</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Team Average</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">32</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4.8/5</p>
              </div>
            </>
          )}
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">Chart visualization would be rendered here</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Based on selected report type and date range</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Top Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Technical</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">45%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">HR</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">25%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Payroll</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">20%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Response Time Trend</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">This Week</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">2.3h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Last Week</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">2.7h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Change</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">-15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Team Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Tickets/Agent</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">32</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Resolution Rate</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">CSAT Score</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
