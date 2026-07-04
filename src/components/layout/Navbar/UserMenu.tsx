'use client';

import { LogOut, Settings, UserCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout, getUser, type User } from '@/lib/auth';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Profile"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#94cb3d] text-white font-semibold hover:ring-2 hover:ring-[#94cb3d]/40 transition-all"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span>{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{user?.name ?? 'User'}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{user?.email ?? ''}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 capitalize mt-0.5">{user?.role ?? ''}</p>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => { setOpen(false); if (user) router.push(`/dashboard/${user.role}/${user.id}/profile`); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <UserCircle className="h-4 w-4" />
              My Profile
            </button>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 py-1">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
