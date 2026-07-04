import { clsx } from 'clsx';

type Status = 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'present' | 'absent' | 'late' | 'open' | 'closed' | 'resolved' | 'in_progress' | 'urgent' | string;

const statusConfig: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  present: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  late: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  closed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const classes = statusConfig[status?.toLowerCase?.()] ?? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  const displayLabel = label ?? status?.replace(/_/g, ' ');
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', classes)}>
      {displayLabel}
    </span>
  );
}
