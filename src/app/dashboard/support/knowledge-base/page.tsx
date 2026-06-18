'use client';

import { useState } from 'react';
import { Search, Plus, BookOpen, Eye, ThumbsUp, MoreVertical, FileText, Video, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  author: string;
  views: number;
  helpfulCount: number;
  isPublished: boolean;
  createdAt: string;
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockArticles: Article[] = [
    { id: 'KB-001', title: 'How to reset your password', category: 'Account Settings', tags: ['password', 'security'], author: 'John Doe', views: 1250, helpfulCount: 89, isPublished: true, createdAt: '2024-01-15' },
    { id: 'KB-002', title: 'Submit a leave request guide', category: 'Leave', tags: ['leave', 'requests'], author: 'Jane Smith', views: 987, helpfulCount: 76, isPublished: true, createdAt: '2024-01-14' },
    { id: 'KB-003', title: 'Understanding your payslip', category: 'Payroll', tags: ['payroll', 'salary'], author: 'Mike Wilson', views: 856, helpfulCount: 65, isPublished: true, createdAt: '2024-01-13' },
    { id: 'KB-004', title: 'Mobile app installation guide', category: 'Mobile App', tags: ['mobile', 'installation'], author: 'Sarah Davis', views: 743, helpfulCount: 58, isPublished: true, createdAt: '2024-01-12' },
    { id: 'KB-005', title: 'Attendance marking process', category: 'Attendance', tags: ['attendance', 'check-in'], author: 'Tom Hardy', views: 698, helpfulCount: 52, isPublished: true, createdAt: '2024-01-11' },
    { id: 'KB-006', title: 'Performance review cycle', category: 'Performance', tags: ['performance', 'review'], author: 'Eva Green', views: 543, helpfulCount: 41, isPublished: false, createdAt: '2024-01-10' },
  ];

  const categories = ['All', 'Account Settings', 'Attendance', 'Leave', 'Payroll', 'Performance', 'Mobile App', 'IT Support'];

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Knowledge Base
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Manage help articles, FAQs, and documentation</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockArticles.length}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Articles</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockArticles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ThumbsUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockArticles.reduce((sum, a) => sum + a.helpfulCount, 0)}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Helpful Votes</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <HelpCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mockArticles.filter(a => a.isPublished).length}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-50"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
                {article.category}
              </span>
              <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2">{article.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {article.helpfulCount}
                </span>
              </div>
              {!article.isPublished && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded">Draft</span>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>By {article.author}</span>
              <span>{article.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
