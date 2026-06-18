'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavItem } from './sidebar.config';
import SidebarItem from './SidebarItem';

interface SidebarGroupProps {
  item: NavItem;
  depth?: number;
  collapsed?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export default function SidebarGroup({
  item,
  depth = 0,
  collapsed = false,
  expanded = false,
  onToggle,
}: SidebarGroupProps) {
  const hasChildren = item.children && item.children.length > 0;

  /* Leaf items (no children) render as direct links via SidebarItem */
  if (!hasChildren) {
    return <SidebarItem item={item} depth={depth} collapsed={collapsed} />;
  }

  const Icon = item.icon;

  if (collapsed) {
    return (
      <div className="relative group">
        <button
          type="button"
          className="flex items-center justify-center w-full px-3 py-3 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={item.name}
        >
          <Icon className="w-5 h-5 shrink-0" />
        </button>

        <div className="absolute left-full top-0 ml-2 z-50 hidden group-hover:block w-56 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg py-2">
          <p className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {item.name}
          </p>
          {item.children!.map((child) => (
            <SidebarItem key={child.name} item={child} depth={depth + 1} collapsed={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors ${
          expanded
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
      </button>

      {expanded && (
        <div className="mt-1 ml-4 space-y-1">
          {item.children!.map((child) => (
            <SidebarItem key={child.name} item={child} depth={depth + 1} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
}
