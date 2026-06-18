import NotificationsPage from '@/components/Notifications/NotificationsPage';

export default function EmployeeNotificationsPage({
  params,
}: {
  params: { userId: string };
}) {
  return <NotificationsPage userId={params.userId} />;
}
