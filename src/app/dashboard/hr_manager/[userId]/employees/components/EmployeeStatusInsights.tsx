'use client';

import { Users, UserCheck, CalendarOff, UserX, UserPlus } from 'lucide-react';
import StatsCard from '@/components/ui/Card/StatsCard';

interface EmployeeStatusInsightsProps {
  employees: any[];
}

export default function EmployeeStatusInsights({ employees }: EmployeeStatusInsightsProps) {
  // Calculate real statistics from employee data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e: any) => e.status === 'active' || e.isActive !== false).length;
  const inactiveEmployees = employees.filter((e: any) => e.status === 'inactive' || e.isActive === false).length;
  
  // Calculate new employees this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = employees.filter((e: any) => {
    const joinDate = e.dateOfJoining || e.createdAt;
    if (!joinDate) return false;
    const date = new Date(joinDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  // Calculate on leave today (this would need attendance data, using status for now)
  const onLeaveToday = employees.filter((e: any) => e.status === 'on-leave').length;

  const activePercentage = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : '0';
  const inactivePercentage = totalEmployees > 0 ? ((inactiveEmployees / totalEmployees) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatsCard 
        title="Total Employees" 
        value={totalEmployees.toString()} 
        icon={Users} 
        trend={newThisMonth > 0 ? `${newThisMonth} new` : undefined} 
        trendUp={newThisMonth > 0}
      />
      <StatsCard 
        title="Active" 
        value={activeEmployees.toString()} 
        icon={UserCheck} 
        trend={`${activePercentage}%`} 
        trendUp 
      />
      <StatsCard 
        title="On Leave Today" 
        value={onLeaveToday.toString()} 
        icon={CalendarOff}
      />
      <StatsCard 
        title="Inactive" 
        value={inactiveEmployees.toString()} 
        icon={UserX} 
        trend={`${inactivePercentage}%`} 
        trendUp={false}
      />
      <StatsCard 
        title="New This Month" 
        value={newThisMonth.toString()} 
        icon={UserPlus} 
        trend={newThisMonth > 0 ? 'Active' : undefined} 
        trendUp={newThisMonth > 0}
      />
    </div>
  );
}
