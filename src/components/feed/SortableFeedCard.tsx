'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FeedItem } from '@/src/types/content';
import { FeedCard } from './FeedCard';

interface SortableFeedCardProps {
  item: FeedItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  layoutMode?: 'grid' | 'list';
}

export const SortableFeedCard: React.FC<SortableFeedCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  layoutMode = 'grid',
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <FeedCard
        item={item}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        layoutMode={layoutMode}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
