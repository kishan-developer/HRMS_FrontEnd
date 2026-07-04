import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default async function SuperAdminUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <DashboardLayout role="superadmin">
      <AuthGuard requiredRole="superadmin" userId={userId}>
        {children}
      </AuthGuard>
    </DashboardLayout>
  );
}
