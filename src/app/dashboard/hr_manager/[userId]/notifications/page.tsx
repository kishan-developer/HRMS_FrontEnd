import NotificationsPage from '@/components/Notifications/NotificationsPage';

export default function HRManagerNotificationsPage({
  params,
}: {
  params: { userId: string };
}) {
  return <NotificationsPage userId={params.userId} />;
}
