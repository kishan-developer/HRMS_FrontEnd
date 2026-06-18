'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from './sidebar.config';

interface SidebarItemProps {
  item: NavItem;
  depth?: number;
  collapsed?: boolean;
}

export default function SidebarItem({ item, depth = 0, collapsed = false }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const paddingClass = depth === 0 ? 'px-4' : 'px-3';
  const textSize = depth === 0 ? 'text-sm' : 'text-xs';

  if (collapsed) {
    return (
      <Link
        href={item.href}
        className={`flex items-center justify-center px-3 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-[#94cb3d] text-white'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
        title={item.name}
      >
        <Icon className="w-5 h-5 shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 ${paddingClass} py-2.5 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#94cb3d] text-white'
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className={`${textSize} font-medium truncate`}>{item.name}</span>
    </Link>
  );
}
