'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleFavorite } from '@/src/store/slices/favoritesSlice';
import { ContentItem } from '@/src/types/content';

interface FavoriteButtonProps {
  item: ContentItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  className = '',
  size = 'md',
}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(item.id);

  const sizeClasses = {
    sm: 'p-1.5 rounded-lg text-xs',
    md: 'p-2 rounded-xl text-sm',
    lg: 'p-2.5 rounded-xl text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.75 }}
      whileHover={{ scale: 1.08 }}
      onClick={handleToggle}
      aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
      aria-pressed={isFavorite}
      className={`transition-all duration-200 select-none flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        isFavorite
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm'
          : 'text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 border border-transparent'
      } ${sizeClasses[size]} ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Heart className={`${iconSizes[size]} ${isFavorite ? 'fill-emerald-500 text-emerald-500' : ''}`} />
      </motion.div>
    </motion.button>
  );
};
