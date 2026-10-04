'use client';

import React from 'react';
import { FeedItem } from '@/src/types/content';
import { NewsCard } from './NewsCard';
import { MovieCard } from './MovieCard';
import { SocialCard } from './SocialCard';
import { FeedCard } from '../feed/FeedCard';

interface ContentCardProps {
  item: FeedItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  layoutMode?: 'grid' | 'list';
  dragHandleProps?: Record<string, any>;
  variant?: 'polymorphic' | 'standard';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  layoutMode = 'grid',
  dragHandleProps,
  variant = 'polymorphic',
}) => {
  if (variant === 'standard' || layoutMode === 'list') {
    return (
      <FeedCard
        item={item}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        layoutMode={layoutMode}
        dragHandleProps={dragHandleProps}
      />
    );
  }

  switch (item.type) {
    case 'news':
      return (
        <NewsCard
          item={item}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          dragHandleProps={dragHandleProps}
        />
      );
    case 'movie':
      return (
        <MovieCard
          item={item}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          dragHandleProps={dragHandleProps}
        />
      );
    case 'social':
      return (
        <SocialCard
          item={item}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          dragHandleProps={dragHandleProps}
        />
      );
    default:
      return (
        <FeedCard
          item={item}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          layoutMode={layoutMode}
          dragHandleProps={dragHandleProps}
        />
      );
  }
};
