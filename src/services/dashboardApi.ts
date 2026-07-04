import { api } from './api';

export interface SuperAdminSummary {
  totalCompanies: number;
  activeCompanies: number;
  trialCompanies: number;
  expiredCompanies: number;
  totalUsers: number;
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  openSupportTickets: number;
  recentActivities?: Array<{ description: string; createdAt: string; type?: string }>;
}

export interface HRSummary {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateEmployees: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  pendingRegularization: number;
  upcomingBirthdays?: Array<{ firstName: string; lastName: string; birthDate: string }>;
  recentAttendanceLogs?: Array<{ employeeId: string; name: string; punchInTime: string; status: string }>;
}

export interface AccountsSummary {
  currentPayrollMonth: string;
  totalPayrollAmount: number;
  pendingPayrollApprovals: number;
  generatedPayslips: number;
  pendingReimbursements: number;
  salaryExceptionCount: number;
  employeeCount: number;
  pfContributions?: number;
  esiContributions?: number;
}

export interface SupportSummary {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  urgentTickets: number;
  slaPendingTickets: number;
  recentTickets?: Array<{ _id: string; title: string; status: string; priority: string; createdAt: string }>;
}

export interface EmployeeSummary {
  todayAttendance?: {
    status: string;
    punchInTime?: string;
    punchOutTime?: string;
    totalHours?: number;
    isLate?: boolean;
  };
  leaveBalance?: Array<{ leaveType: string; balance: number; used: number; total: number }>;
  pendingLeaves: number;
  latestPayslip?: { month: string; year: number; netPay: number };
  notifications?: number;
  monthlySummary?: { present: number; absent: number; late: number; workingDays: number };
}

export const dashboardApi = {
  getSuperAdminSummary: () =>
    api.get<{ success: boolean; data: SuperAdminSummary }>('/dashboard/super-admin/summary'),

  getHRSummary: () =>
    api.get<{ success: boolean; data: HRSummary }>('/dashboard/hr/summary'),

  getAccountsSummary: () =>
    api.get<{ success: boolean; data: AccountsSummary }>('/dashboard/accounts/summary'),

  getSupportSummary: () =>
    api.get<{ success: boolean; data: SupportSummary }>('/dashboard/support/summary'),

  getEmployeeSummary: () =>
    api.get<{ success: boolean; data: EmployeeSummary }>('/dashboard/employee/summary'),
};
