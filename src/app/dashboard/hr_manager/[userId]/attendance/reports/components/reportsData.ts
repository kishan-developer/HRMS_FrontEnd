export type ReportStatus = 'Present' | 'Absent' | 'Leave' | 'Late' | 'Early Out';
export type RegStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Sick' | 'Casual' | 'Earned' | 'Unpaid';
export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';
export type Role = 'admin' | 'hr' | 'manager';

export interface ReportRow {
  id?: string;
  _id?: string;
  empId: string;
  name: string;
  department: string;
  shift: string;
  date: string; // YYYY-MM-DD
  inTime: string | null;
  outTime: string | null;
  totalHours: number; // decimal
  status: ReportStatus;
  lateMinutes: number;
  earlyOutMinutes: number;
  overtimeHours: number;
  regularization: RegStatus;
}

export interface LeaveRecord {
  id?: string;
  _id?: string;
  empId: string;
  name: string;
  department: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
}

export interface RegularizationRecord {
  id?: string;
  _id?: string;
  empId: string;
  name: string;
  department: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const DEPARTMENTS = ['All Departments', 'Real Estate', 'Hotels', 'Saree Manufacturing', 'Corporate HO'];
export const SHIFTS = ['All Shifts', 'General', 'Morning', 'Evening', 'Night'];
export const STATUSES: Array<ReportStatus | 'All'> = ['All', 'Present', 'Absent', 'Leave', 'Late', 'Early Out'];

export const STATUS_BADGE: Record<ReportStatus, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  Present: 'success',
  Absent: 'error',
  Leave: 'info',
  Late: 'warning',
  'Early Out': 'warning',
};

export const REPORT_ROWS: ReportRow[] = [];
export const LEAVE_ROWS: LeaveRecord[] = [];
export const REGULARIZATION_ROWS: RegularizationRecord[] = [];
export const EMPLOYEE_NAMES: string[] = [];
