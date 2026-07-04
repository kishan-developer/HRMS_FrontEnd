import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default async function HRManagerUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <DashboardLayout role="hr_manager">
      <AuthGuard requiredRole="hr_manager" userId={userId}>
        {children}
      </AuthGuard>
    </DashboardLayout>
  );
}
