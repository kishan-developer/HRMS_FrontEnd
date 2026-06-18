export interface User {
  _id: string;
  id?: string;
  email: string;
  employeeId: string;
  role: 'superadmin' | 'hr_manager' | 'accounts' | 'employee' | 'support';
  isActive: boolean;
  lastLogin?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  joiningDate?: string;
  departmentId?: string;
  roleId?: string;
  shiftId?: string;
  employeeStatus: 'Active' | 'Inactive' | 'On Leave' | 'Probation';
  workType: 'Office' | 'Remote' | 'On Field';
  photoUrl?: string;
  address?: string;
  designation?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

// Deprecated: Use User instead
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'vacation' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}
