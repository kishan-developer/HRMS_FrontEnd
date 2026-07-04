'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Download, Filter, FileText, BarChart3, Users, Star, Target, TrendingUp, MessageSquare } from 'lucide-react';
import { useGetPerformanceReportQuery } from '@/store/services/reportsApi';
import { useGetReviewsQuery, useGetKPIsQuery, useGetFeedbackQuery } from '@/store/services/performanceApi';

type DateFilter = 'today' | 'week' | 'month' | 'custom';

export default function PerformanceReportsPage() {
  const { userId } = useParams();
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (dateFilter) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() + (6 - dayOfWeek));
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(now.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        if (customStartDate) start.setTime(new Date(customStartDate).getTime());
        if (customEndDate) end.setTime(new Date(customEndDate).getTime());
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [dateFilter, customStartDate, customEndDate]);

  // Redux API calls
  const { data: performanceReport, isLoading: reportLoading } = useGetPerformanceReportQuery({});
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery({});
  const { data: kpisData, isLoading: kpisLoading } = useGetKPIsQuery({});
  const { data: feedbackData, isLoading: feedbackLoading } = useGetFeedbackQuery({});

  // Extract data from API responses
  const reportData = Array.isArray(performanceReport?.data) ? performanceReport.data : [];
  const reviews = Array.isArray(reviewsData?.data) ? reviewsData.data : [];
  const kpis = Array.isArray(kpisData?.data) ? kpisData.data : [];
  const feedback = Array.isArray(feedbackData?.data) ? feedbackData.data : [];

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';
  const totalKPIs = kpis.length;
  const activeKPIs = kpis.filter((k: any) => k.status === 'active').length;
  const totalFeedback = feedback.length;
  const positiveFeedback = feedback.filter((f: any) => f.sentiment === 'positive').length;

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review: any) => {
      if (selectedDepartment !== 'all' && review.department !== selectedDepartment) return false;
      if (selectedRating !== 'all') {
        const rating = review.rating || 0;
        if (selectedRating === '5' && rating !== 5) return false;
        if (selectedRating === '4' && rating < 4) return false;
        if (selectedRating === '3' && rating < 3) return false;
        if (selectedRating === '2' && rating < 2) return false;
        if (selectedRating === '1' && rating < 1) return false;
      }
      return true;
    });
  }, [reviews, selectedDepartment, selectedRating]);

  const handleExportCSV = () => {
    const headers = ['Employee', 'Department', 'Reviewer', 'Rating', 'Review Date', 'Comments', 'Status'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...filteredReviews.map((r: any) =>
        [
          r.employeeName || '-',
          r.department || '-',
          r.reviewerName || '-',
          r.rating || '0',
          r.reviewDate || '-',
          r.comments || '-',
          r.status || '-',
        ].map(escape).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const html = `<!doctype html><html><head><title>Performance Report</title>
<style>body{font-family:sans-serif;padding:20px}h1{font-size:18px;margin:0 0 12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #ddd;padding:5px;text-align:left}th{background:#f5f5f5}.meta{color:#666;font-size:11px;margin-bottom:10px}</style>
</head><body>
<h1>Performance Report</h1>
<div class="meta">${dateRange.startDate} → ${dateRange.endDate} · ${filteredReviews.length} reviews · Avg Rating: ${averageRating}</div>
<table><thead><tr><th>Employee</th><th>Department</th><th>Reviewer</th><th>Rating</th><th>Comments</th><th>Status</th></tr></thead>
<tbody>${filteredReviews.map((r: any) => `<tr><td>${r.employeeName || '-'}</td><td>${r.department || '-'}</td><td>${r.reviewerName || '-'}</td><td>${r.rating || '0'}/5</td><td>${r.comments || '-'}</td><td>${r.status || '-'}</td></tr>`).join('')}</tbody></table>
<script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank', 'width=1000,height=700');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateKPIProgress = (kpi: any) => {
    const target = Number(kpi.target) || 1;
    const current = Number(kpi.current) || 0;
    return Math.min((current / target) * 100, 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Performance Reports</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Comprehensive performance analytics and reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Filters:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {dateFilter === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
                <span className="text-zinc-500 dark:text-zinc-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            )}
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Reviews</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Avg Rating</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active KPIs</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{activeKPIs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Feedback</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalFeedback}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total KPIs</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{totalKPIs}</p>
            </div>
            <Target className="h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Positive Feedback</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{positiveFeedback}</p>
            </div>
            <MessageSquare className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Performance Reviews Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Performance Reviews</h2>
          <span className="text-xs text-zinc-500">{filteredReviews.length} reviews</span>
        </div>
        
        {reviewsLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Reviewer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Review Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Comments</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredReviews.slice(0, 50).map((review: any, index: number) => (
                  <tr key={review._id || review.id || index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{review.employeeName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{review.department || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{review.reviewerName || '-'}</td>
                    <td className="px-4 py-3">{getRatingStars(review.rating || 0)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{review.reviewDate || '-'}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{review.comments || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {review.status || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KPIs Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Key Performance Indicators</h2>
          <span className="text-xs text-zinc-500">{kpis.length} KPIs</span>
        </div>
        
        {kpisLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading KPIs...</p>
          </div>
        ) : kpis.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No KPIs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.slice(0, 6).map((kpi: any, index: number) => {
              const progress = calculateKPIProgress(kpi);
              return (
                <div key={kpi._id || kpi.id || index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{kpi.name || 'Unnamed KPI'}</h3>
                    <span className="text-xs text-zinc-500">{kpi.category || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                    <span>Progress: {progress}%</span>
                    <span>{kpi.current || 0} / {kpi.target || 0}</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#94cb3d] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Feedback</h2>
          <span className="text-xs text-zinc-500">{feedback.length} feedback items</span>
        </div>
        
        {feedbackLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No feedback found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedback.slice(0, 6).map((item: any, index: number) => (
              <div key={item._id || item.id || index} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">{item.type || 'General'}</span>
                </div>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 line-clamp-3">
                  {item.message || item.content || 'No message'}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  {item.fromUser || 'Anonymous'} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Performance Analytics</h2>
        <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Analytics charts will be displayed here</p>
            <p className="text-xs text-zinc-400 mt-1">Connect chart library for visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
