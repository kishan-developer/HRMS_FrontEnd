import HRNotificationManager from '@/components/Notifications/HRNotificationManager';

export default async function HRManagerNotificationsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <HRNotificationManager userId={userId} />;
}
