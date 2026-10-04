import React from 'react';
import { Skeleton, FeedCardSkeleton } from './Skeleton';

export const LoadingSkeleton: React.FC<{ count?: number; layoutMode?: 'grid' | 'list' }> = ({
  count = 6,
  layoutMode = 'grid',
}) => {
  return (
    <div
      className={`grid gap-6 ${
        layoutMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <FeedCardSkeleton key={`skeleton-${i}`} layoutMode={layoutMode} />
      ))}
    </div>
  );
};
