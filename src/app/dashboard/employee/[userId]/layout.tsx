import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default async function EmployeeUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <DashboardLayout role="employee">
      <AuthGuard requiredRole="employee" userId={userId}>
        {children}
      </AuthGuard>
    </DashboardLayout>
  );
}
