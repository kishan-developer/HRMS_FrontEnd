import NotificationsPage from '@/components/Notifications/NotificationsPage';

export default function SuperAdminNotificationsPage({
  params,
}: {
  params: { userId: string };
}) {
  return <NotificationsPage userId={params.userId} />;
}
