export type ShiftType = 'General' | 'Night' | 'Rotational' | 'Split';
export type ShiftStatus = 'Active' | 'Inactive';
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Shift {
  id?: string;
  _id?: string;
  name: string;
  code: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  breakMinutes: number;
  workingHours?: string; // computed display
  type: ShiftType;
  assignedCount?: number;
  status: ShiftStatus;
  allowedLateMinutes?: number;
  allowedEarlyOutMinutes?: number;
  weeklyOff?: WeekDay[];
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ShiftAssignment {
  id?: string;
  _id?: string;
  shiftId: string;
  empId: string;
  empName: string;
  department: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface AuditLog {
  id?: string;
  _id?: string;
  shiftId: string;
  shiftName: string;
  action: 'created' | 'edited' | 'deleted' | 'duplicated' | 'assigned' | 'status-changed';
  actor: string;
  timestamp: string;
  detail?: string;
}

export const DEPARTMENTS = ['All Departments', 'Real Estate', 'Hotels', 'Saree Manufacturing', 'Corporate HO'];
export const SHIFT_TYPES: Array<ShiftType | 'All Types'> = ['All Types', 'General', 'Night', 'Rotational', 'Split'];
export const STATUS_OPTIONS: Array<ShiftStatus | 'All'> = ['All', 'Active', 'Inactive'];
export const WEEK_DAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SAMPLE_EMPLOYEES: Array<{ id: string; name: string; department: string }> = [];

const parseHM = (hm: string) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

export function calcWorkingHours(start: string, end: string, breakMin: number): string {
  if (!start || !end) return '0h 00m';
  const s = parseHM(start);
  let e = parseHM(end);
  if (e <= s) e += 24 * 60; // overnight shift
  const total = Math.max(0, e - s - breakMin);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}
