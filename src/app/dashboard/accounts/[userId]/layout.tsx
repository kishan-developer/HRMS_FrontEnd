import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default async function AccountsUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <DashboardLayout role="accounts">
      <AuthGuard requiredRole="accounts" userId={userId}>
        {children}
      </AuthGuard>
    </DashboardLayout>
  );
}
