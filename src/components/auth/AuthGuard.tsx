'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingState';
import type { AppRole } from '@/lib/roleRedirect';
import { getDashboardPath } from '@/lib/roleRedirect';

interface AuthGuardProps {
  requiredRole: AppRole;
  userId: string;
  children: React.ReactNode;
}

export default function AuthGuard({ requiredRole, userId, children }: AuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) {
      const currentPath = window.location.pathname;
      localStorage.setItem('intendedUrl', currentPath);
      router.replace('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      const role = user?.role as string;

      if (role !== requiredRole && role !== 'superadmin') {
        const correctPath = getDashboardPath(role, user?.id ?? userId);
        router.replace(correctPath);
        return;
      }

      const storedUserId = user?.id;
      if (storedUserId && storedUserId !== userId) {
        const correctPath = getDashboardPath(role, storedUserId);
        router.replace(correctPath);
        return;
      }
    } catch {
      router.replace('/auth/login');
      return;
    }

    setReady(true);
  }, [requiredRole, userId, router]);

  if (!ready) return <LoadingSpinner className="py-32" />;
  return <>{children}</>;
}
