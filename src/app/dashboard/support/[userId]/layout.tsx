import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';

export default async function SupportUserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <DashboardLayout role="support">
      <AuthGuard requiredRole="support" userId={userId}>
        {children}
      </AuthGuard>
    </DashboardLayout>
  );
}
