'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { getCurrentManagerId, loadManagerPermissions, hasPermission } from '@/lib/permissions';
import { getCurrentUserId, replaceUserIdInNavigation } from '@/lib/navigation';
import { superadminNavigation, hrManagerNavigation, accountsNavigation, supportNavigation, employeeNavigation, type Role, type NavItem, type Permission } from './sidebar.config';
import SidebarGroup from './SidebarGroup';
import SidebarFooter from './SidebarFooter';

function filterNavByPermissions(items: NavItem[], allowed: Permission[]): NavItem[] {
  return items
    .map((item) => {
      if (!hasPermission(allowed, item.permission)) return null;
      const filtered: NavItem = { ...item };
      if (item.children) {
        filtered.children = item.children.filter(() => true);
      }
      return filtered;
    })
    .filter(Boolean) as NavItem[];
}

function addGrantedPages(items: NavItem[], grantedRoutes: string[]): NavItem[] {
  if (!grantedRoutes || grantedRoutes.length === 0) {
    return items;
  }
  
  // For now, just return items since we want to show all default pages
  // The granted pages will be added when we implement cross-role page access
  return items;
}

function filterNavByPageIds(items: NavItem[], allowedPageIds: string[]): NavItem[] {
  console.log('Filtering navigation, allowedPageIds:', allowedPageIds);
  console.log('Items to filter:', items.map(i => i.name));
  // If no page IDs are provided, show all pages (default behavior)
  if (!allowedPageIds || allowedPageIds.length === 0) {
    console.log('No permissions set, showing all pages');
    return items;
  }
  
  // If specific permissions are set, show only those pages
  return items
    .map((item) => {
      const filtered: NavItem = { ...item };
      if (item.children) {
        filtered.children = item.children.filter((child) => {
          // Normalize the route for comparison
          const route = child.href
            .replace(/:userId/g, '')
            .replace(/\/dashboard\/[^\/]+\//, '/dashboard/[role]/');
          
          // Check if this route matches any allowed page route
          return allowedPageIds.some((pageId: string) => {
            const normalizedPageId = pageId
              .replace(/\/dashboard\/[^\/]+\//, '/dashboard/[role]/');
            
            // Check if routes match
            if (route === normalizedPageId) return true;
            
            // Check if one route includes the other
            if (route.includes(normalizedPageId) || normalizedPageId.includes(route)) return true;
            
            return false;
          });
        });
        if (filtered.children.length === 0) return null;
      } else {
        // For items without children, check if they are allowed
        const route = item.href
          .replace(/:userId/g, '')
          .replace(/\/dashboard\/[^\/]+\//, '/dashboard/[role]/');
        
        const isAllowed = allowedPageIds.some((pageId: string) => {
          const normalizedPageId = pageId
            .replace(/\/dashboard\/[^\/]+\//, '/dashboard/[role]/');
          
          if (route === normalizedPageId) return true;
          if (route.includes(normalizedPageId) || normalizedPageId.includes(route)) return true;
          return false;
        });
        
        if (!isAllowed) return null;
      }
      return filtered;
    })
    .filter(Boolean) as NavItem[];
}

export default function Sidebar({ fixedRole }: { fixedRole?: Role } = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [internalRole, setInternalRole] = useState<Role>('superadmin');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [userPageIds, setUserPageIds] = useState<string[]>([]);
  const [userRoutes, setUserRoutes] = useState<string[]>([]);
  
  // Initialize with base navigation without userId replacement for SSR
  const [navigation, setNavigation] = useState<NavItem[]>(fixedRole === 'hr_manager' ? hrManagerNavigation : superadminNavigation);

  const role = fixedRole ?? internalRole;

  useEffect(() => {
    const savedCollapsed = localStorage.getItem(STORAGE_KEYS.COLLAPSED);
    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    const savedExpanded = localStorage.getItem(STORAGE_KEYS.EXPANDED);

    if (savedCollapsed) setCollapsed(JSON.parse(savedCollapsed));
    if (savedRole && !fixedRole) setInternalRole(savedRole as Role);
    if (savedExpanded) setExpanded(JSON.parse(savedExpanded));
  }, [fixedRole]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const userId = getCurrentUserId();
        console.log('Fetching permissions for userId:', userId);
        if (!userId) return;
        
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/v1/access-control/user-permissions/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        const data = await response.json();
        console.log('User permissions response:', data);
        if (data.success) {
          setUserPageIds(data.data.pageIds || []);
          setUserRoutes(data.data.routes || []);
          console.log('User routes set:', data.data.routes || []);
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };

    fetchUserPermissions();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLAPSED, JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (fixedRole) return;
    localStorage.setItem(STORAGE_KEYS.ROLE, internalRole);
  }, [internalRole, fixedRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPANDED, JSON.stringify(expanded));
  }, [expanded]);

  const toggleSection = (name: string) => {
    setExpanded((prev) => {
      const isOpening = !prev[name];
      if (isOpening) {
        return { [name]: true };
      }
      return {};
    });
  };

  const toggleRole = () => {
    if (fixedRole) return;
    setInternalRole((prev) => (prev === 'superadmin' ? 'hr_manager' : 'superadmin'));
  };

  useEffect(() => {
    try {
      const userId = getCurrentUserId();
      let baseNavigation: NavItem[];
      
      if (role === 'superadmin') {
        baseNavigation = superadminNavigation;
      } else if (role === 'hr_manager') {
        const managerId = getCurrentManagerId();
        const allowed = loadManagerPermissions(managerId);
        baseNavigation = filterNavByPermissions(hrManagerNavigation, allowed);
      } else if (role === 'accounts') {
        baseNavigation = accountsNavigation;
      } else if (role === 'support') {
        baseNavigation = supportNavigation;
      } else if (role === 'employee') {
        baseNavigation = employeeNavigation;
      } else {
        baseNavigation = [];
      }
      
      let filteredNavigation = addGrantedPages(baseNavigation, userRoutes);
      setNavigation(userId ? replaceUserIdInNavigation(filteredNavigation, userId) : filteredNavigation);
    } catch (error) {
      console.error('Error updating navigation:', error);
      // Fallback to default navigation based on role
      const fallbackNav = role === 'hr_manager' ? hrManagerNavigation : superadminNavigation;
      setNavigation(fallbackNav);
    }
  }, [role, userRoutes]);

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } sticky top-0 h-screen flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-200 shrink-0`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-zinc-200 dark:border-zinc-800`}>
        {!collapsed && (
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
            Coral HRMS
          </h1>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className={`${collapsed ? 'px-2' : 'px-3'} flex-1 space-y-1 overflow-y-auto py-3`}>
        {navigation.map((item) => (
          <SidebarGroup
            key={item.name}
            item={item}
            collapsed={collapsed}
            expanded={expanded[item.name] || false}
            onToggle={() => toggleSection(item.name)}
          />
        ))}
      </nav>

      <SidebarFooter role={role} collapsed={collapsed} onRoleToggle={fixedRole ? undefined : toggleRole} />
    </aside>
  );
}
