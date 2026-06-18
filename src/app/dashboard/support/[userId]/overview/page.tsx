'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, MapPin, Building2, FileText, Activity } from 'lucide-react';

export default function SupportUserOverview() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`);
      const data = await response.json();
      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
          Loading user overview...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            User Overview
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            User ID: {userId}
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-[#94cb3d] bg-opacity-20 flex items-center justify-center">
            <User className="h-10 w-10 text-[#94cb3d]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {userData?.name || 'User Name'}
            </h2>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                {userData?.email || 'user@example.com'}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="h-4 w-4" />
                {userData?.mobile || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Building2 className="h-4 w-4" />
                {userData?.department || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4" />
                {userData?.branch || 'N/A'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              userData?.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {userData?.isActive ? 'Active' : 'Inactive'}
            </span>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Role: {userData?.role || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Tickets</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Open Tickets</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Last Login</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Account Age</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Ticket #1234 created', time: '2 hours ago', status: 'open' },
            { action: 'Ticket #1230 resolved', time: '1 day ago', status: 'resolved' },
            { action: 'Profile information updated', time: '3 days ago', status: 'info' },
            { action: 'Password changed', time: '1 week ago', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'open' ? 'bg-blue-500' :
                  activity.status === 'resolved' ? 'bg-green-500' : 'bg-zinc-500'
                }`} />
                <p className="text-sm text-zinc-900 dark:text-zinc-50">{activity.action}</p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
