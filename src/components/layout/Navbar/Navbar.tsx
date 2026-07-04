'use client';

import { useEffect, useState } from 'react';
import Notifications from './Notifications';
import UserMenu from './UserMenu';
import { type Role } from '../Sidebar/sidebar.config';
import { getUser } from '@/lib/auth';

const welcomeMessages: Record<string, string> = {
  superadmin: 'Manage your HR operations efficiently',
  hr_manager: 'Oversee your team and operations',
  accounts: 'Manage financial operations',
  support: 'Handle support tickets',
  employee: 'Manage your HR tasks',
};

export default function Navbar({ role = 'superadmin' }: { role?: Role }) {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const user = getUser();
    if (user?.name) setUserName(user.name);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {welcomeMessages[role] ?? 'Welcome back'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
