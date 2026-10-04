import React from 'react';
import { cn } from '@/src/lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80',
        className
      )}
      {...props}
    />
  );
};

export const FeedCardSkeleton: React.FC<{ layoutMode?: 'grid' | 'list' }> = ({
  layoutMode = 'grid',
}) => {
  if (layoutMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
        <Skeleton className="w-full sm:w-48 h-36 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-sm">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
