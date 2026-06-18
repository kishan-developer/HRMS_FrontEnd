'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function toTitleCase(segment: string) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Check if a segment is a dynamic route parameter
function isDynamicSegment(segment: string) {
  return segment.startsWith('[') && segment.endsWith(']');
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const pathSegments = segments.slice(0, index + 1);
    const href = '/' + pathSegments.join('/');
    const isLast = index === segments.length - 1;
    const isDynamic = isDynamicSegment(segment);
    // Check if any segment in the path up to this point is dynamic
    const pathContainsDynamic = pathSegments.some(s => isDynamicSegment(s));
    const label = isDynamic ? 'Details' : toTitleCase(segment);
    return { href, label, isLast, isDynamic, pathContainsDynamic };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-[#94cb3d] transition-colors">
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {crumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-zinc-400" />
          {crumb.isLast || crumb.pathContainsDynamic ? (
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-[#94cb3d] transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
