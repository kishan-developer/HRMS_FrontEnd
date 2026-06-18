'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/constants';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Save the intended redirect URL
      const intendedUrl = window.location.pathname + window.location.search;
      localStorage.setItem('intendedUrl', intendedUrl);
      router.replace('/auth/login');
      return;
    }

    const user = JSON.parse(userStr);
    const role = user.role;

    // Check if there was an intended redirect URL
    const intendedUrl = localStorage.getItem('intendedUrl');
    if (intendedUrl) {
      localStorage.removeItem('intendedUrl');
      router.replace(intendedUrl);
      return;
    }

    if (role === 'superadmin') {
      router.replace(`/dashboard/superadmin/${user.id}/overview`);
    } else if (role === 'hr_manager') {
      router.replace(`/dashboard/hr_manager/${user.id}/overview`);
    } else if (role === 'accounts') {
      router.replace(`/dashboard/accounts/${user.id}/overview`);
    } else if (role === 'support') {
      router.replace(`/dashboard/support/${user.id}/overview`);
    } else if (role === 'employee') {
      router.replace(`/dashboard/employee/${user.id}/overview`);
    } else {
      router.replace(`/dashboard/hr_manager/${user.id}/overview`); // Default fallback
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
        Loading dashboard...
      </div>
    </div>
  );
}
