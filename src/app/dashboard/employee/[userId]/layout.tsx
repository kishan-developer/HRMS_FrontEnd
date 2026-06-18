import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EmployeeUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  return <DashboardLayout role="employee">{children}</DashboardLayout>;
}
