export type AppRole = 'superadmin' | 'hr_manager' | 'accounts' | 'support' | 'employee';

export function getDashboardPath(role: string, userId: string): string {
  const roleMap: Record<string, string> = {
    superadmin: `/dashboard/superadmin/${userId}/overview`,
    hr_manager: `/dashboard/hr_manager/${userId}/overview`,
    accounts: `/dashboard/accounts/${userId}/overview`,
    support: `/dashboard/support/${userId}/overview`,
    employee: `/dashboard/employee/${userId}/overview`,
  };
  return roleMap[role] ?? '/dashboard';
}

export function isAllowedRole(pageRole: AppRole, userRole: string): boolean {
  if (userRole === 'superadmin') return true;
  return pageRole === userRole;
}
