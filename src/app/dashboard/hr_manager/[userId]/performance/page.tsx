'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Star, MessageSquare, Plus, Filter } from 'lucide-react';
import { useGetReviewsQuery, useGetKPIsQuery, useGetFeedbackQuery } from '@/store/services/performanceApi';

export default function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery({});
  const { data: kpisData, isLoading: kpisLoading } = useGetKPIsQuery({});
  const { data: feedbackData, isLoading: feedbackLoading } = useGetFeedbackQuery({});

  const reviews = Array.isArray(reviewsData?.data) ? reviewsData.data : [];
  const kpis = Array.isArray(kpisData?.data) ? kpisData.data : [];
  const feedback = Array.isArray(feedbackData?.data) ? feedbackData.data : [];

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const calculateKPIProgress = () => {
    if (kpis.length === 0) return 0;
    const totalProgress = kpis.reduce((sum: number, kpi: any) => {
      const target = Number(kpi.target) || 1;
      const current = Number(kpi.current) || 0;
      return sum + (current / target) * 100;
    }, 0);
    return Math.min((totalProgress / kpis.length), 100).toFixed(1);
  };

  const filteredReviews = reviews.filter((r: any) =>
    r.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Performance Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Track employee performance, KPIs, and feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm text-zinc-700 dark:text-zinc-300 bg-transparent focus:outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Reviews</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Avg Rating</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{calculateAverageRating()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Active KPIs</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{kpis.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">KPI Progress</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{calculateKPIProgress()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Performance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Performance chart will be displayed here</p>
              <p className="text-xs text-zinc-400 mt-1">Connect chart library for visualization</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Employees Reviewed</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {new Set(reviews.map((r: any) => r.employeeId)).size}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Pending Reviews</span>
              <span className="text-sm font-medium text-yellow-600">
                {reviews.filter((r: any) => r.status === 'pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Completed Reviews</span>
              <span className="text-sm font-medium text-green-600">
                {reviews.filter((r: any) => r.status === 'completed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Feedback</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{feedback.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
        <input
          type="text"
          placeholder="Search reviews by employee or reviewer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#94cb3d]"
        />
      </div>

      {/* Reviews and KPIs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Reviews</h2>
            <span className="text-xs text-zinc-500">{filteredReviews.length} reviews</span>
          </div>
          {reviewsLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading reviews...</p>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.slice(0, 5).map((review: any) => (
                <div key={review._id || review.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {review.employeeName || 'Unknown Employee'}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (review.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">{review.reviewerName || 'Unknown Reviewer'}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                    {review.comments || 'No comments'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top KPIs */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Top KPIs</h2>
            <span className="text-xs text-zinc-500">{kpis.length} KPIs</span>
          </div>
          {kpisLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading KPIs...</p>
          ) : kpis.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No KPIs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {kpis.slice(0, 5).map((kpi: any) => {
                const progress = Math.min(((Number(kpi.current) || 0) / (Number(kpi.target) || 1)) * 100, 100);
                return (
                  <div key={kpi._id || kpi.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {kpi.name || 'Unnamed KPI'}
                      </h3>
                      <span className="text-xs text-zinc-500">{kpi.category || 'General'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                      <span>Progress: {progress.toFixed(1)}%</span>
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
      </div>

      {/* Recent Feedback */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Feedback</h2>
          <span className="text-xs text-zinc-500">{feedback.length} feedback items</span>
        </div>
        {feedbackLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading feedback...</p>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">No feedback found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedback.slice(0, 6).map((item: any) => (
              <div key={item._id || item.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
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
    </div>
  );
}
