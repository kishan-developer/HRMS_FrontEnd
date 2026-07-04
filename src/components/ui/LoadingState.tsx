export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? 'py-16'}`}>
      <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-700 border-t-[#94cb3d] rounded-full animate-spin" />
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
