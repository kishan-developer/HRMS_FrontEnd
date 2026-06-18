'use client';

import Notifications from './Notifications';
import UserMenu from './UserMenu';
import { type Role } from '../Sidebar/sidebar.config';

export default function Navbar({ role = 'superadmin' }: { role?: Role }) {
  const getRoleName = () => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'hr_manager': return 'HR Manager';
      case 'accounts': return 'Accounts';
      case 'support': return 'Support';
      case 'employee': return 'Employee';
      default: return 'User';
    }
  };

  const getWelcomeMessage = () => {
    switch (role) {
      case 'superadmin': return 'Manage your HR operations efficiently';
      case 'hr_manager': return 'Oversee your team and operations';
      case 'accounts': return 'Manage financial operations';
      case 'support': return 'Handle support tickets';
      case 'employee': return 'Manage your HR tasks';
      default: return 'Welcome back';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome back, {getRoleName()}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {getWelcomeMessage()}
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
