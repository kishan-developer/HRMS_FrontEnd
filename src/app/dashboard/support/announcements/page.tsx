'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Megaphone, Calendar, Users, Send, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>('/announcements');
      setAnnouncements(res.data?.announcements ?? res.data?.items ?? res.data ?? []);
    } catch {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  if (false) { const mockAnnouncements = [
    { 
      id: 'ANN-001', 
      title: 'System Maintenance - January 20th', 
      content: 'The HRMS system will be undergoing scheduled maintenance on January 20th from 10 PM to 2 AM. Please save your work before this time.', 
      type: 'Urgent', 
      targetAudience: 'All', 
      isPublished: true, 
      publishDate: '2024-01-15', 
      expiryDate: '2024-01-21',
      createdBy: 'IT Team', 
      createdAt: '2024-01-15' 
    },
    { 
      id: 'ANN-002', 
      title: 'New Leave Policy Update', 
      content: 'Effective from February 1st, the leave policy has been updated with additional provisions for remote work.', 
      type: 'Policy Update', 
      targetAudience: 'Employees', 
      isPublished: true, 
      publishDate: '2024-01-14',
      createdBy: 'HR Department', 
      createdAt: '2024-01-14' 
    },
    { 
      id: 'ANN-003', 
      title: 'Mobile App Version 2.0 Release', 
      content: 'We are excited to announce the release of Mobile App Version 2.0 with new features and improvements.', 
      type: 'Information', 
      targetAudience: 'All', 
      isPublished: true, 
      publishDate: '2024-01-13',
      createdBy: 'Product Team', 
      createdAt: '2024-01-13' 
    },
    { 
      id: 'ANN-004', 
      title: 'Quarterly Performance Review Schedule', 
      content: 'The quarterly performance review cycle will begin on February 15th. Managers should start preparing evaluations.', 
      type: 'Information', 
      targetAudience: 'Managers', 
      isPublished: false,
      createdBy: 'HR Department', 
      createdAt: '2024-01-12' 
    },
    { 
      id: 'ANN-005', 
      title: 'Payroll Processing Timeline', 
      content: 'Payroll for January will be processed on January 25th. Ensure all attendance is marked by January 23rd.', 
      type: 'General', 
      targetAudience: 'All', 
      isPublished: true, 
      publishDate: '2024-01-11',
      createdBy: 'Payroll Team', 
      createdAt: '2024-01-11' 
    },
  ];

  } // end if(false)

  const filteredAnnouncements = announcements.filter((ann: any) => {
    const title = (ann.title ?? '').toLowerCase();
    const content = (ann.content ?? ann.body ?? '').toLowerCase();
    const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || content.includes(searchQuery.toLowerCase());
    const published = ann.isPublished ?? ann.status === 'published';
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Published' && published) || (statusFilter === 'Draft' && !published);
    const matchesType = typeFilter === 'All' || ann.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-orange-500" />
            Announcements
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Create and manage company announcements</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Delivery Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Dashboard</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Email</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">SMS</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Push Notification</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search announcements..."
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            >
              <option value="All">All Types</option>
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Information">Information</option>
              <option value="Policy Update">Policy Update</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAnnouncements} />
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState title="No announcements" description="No announcements match your current filters." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAnnouncements.map((ann: any) => {
            const published = ann.isPublished ?? ann.status === 'published';
            return (
              <div key={ann._id ?? ann.id} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {ann.type && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{ann.type}</span>
                    )}
                    {ann.targetAudience && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{ann.targetAudience}</span>
                    )}
                    {!published && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full font-medium">Draft</span>
                    )}
                  </div>
                  <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"><MoreVertical className="h-4 w-4" /></button>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{ann.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">{ann.content ?? ann.body}</p>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <span>By {ann.createdBy ?? ann.author}</span>
                  {ann.publishDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ann.publishDate}</span>}
                  <span>{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
