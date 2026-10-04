'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FeedItem } from '@/src/types/content';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { formatDate, formatNumber } from '@/src/lib/utils';
import {
  ExternalLink,
  GripVertical,
  Star,
  Newspaper,
  Film,
  MessageSquare,
  Clock,
  Flame,
} from 'lucide-react';

interface FeedCardProps {
  item: FeedItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  layoutMode?: 'grid' | 'list';
  dragHandleProps?: Record<string, any>;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  layoutMode = 'grid',
  dragHandleProps,
}) => {
  const getTypeBadge = () => {
    switch (item.type) {
      case 'news':
        return (
          <Badge variant="news" className="gap-1">
            <Newspaper className="w-3 h-3" /> News
          </Badge>
        );
      case 'movie':
        return (
          <Badge variant="movie" className="gap-1">
            <Film className="w-3 h-3" /> Movie
          </Badge>
        );
      case 'social':
        return (
          <Badge variant="social" className="gap-1">
            <MessageSquare className="w-3 h-3" /> Community
          </Badge>
        );
    }
  };

  const isListMode = layoutMode === 'list';
  const targetUrl = item.url && item.url !== '#' ? item.url : (item.type === 'movie' ? 'https://www.themoviedb.org' : item.type === 'news' ? 'https://news.google.com' : 'https://dev.to');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-[#0b261c] border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-500/80 dark:hover:border-emerald-400 shadow-sm hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 overflow-hidden ${
        isListMode ? 'sm:flex-row' : ''
      }`}
    >
      {/* Drag Handle Indicator */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white/80 hover:text-white cursor-grab active:cursor-grabbing transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md touch-none"
          title="Drag card to reorder"
          aria-label="Drag card to reorder"
          tabIndex={0}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Card Media Header */}
      {item.imageUrl && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative overflow-hidden bg-emerald-950 block group/img cursor-pointer ${
            isListMode ? 'w-full sm:w-56 h-48 sm:h-auto flex-shrink-0' : 'w-full h-48'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {item.isTrending && (
              <Badge variant="trending" className="gap-1 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border-emerald-500/40">
                <Flame className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Trending
              </Badge>
            )}
            {getTypeBadge()}
          </div>

          {/* Category Chip */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-lg bg-white/25 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider border border-white/20">
              {item.category}
            </span>
          </div>
        </a>
      )}

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Header Metadata (if list mode or no image) */}
          {(!item.imageUrl || isListMode) && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                {item.isTrending && (
                  <Badge variant="trending" className="gap-1">
                    <Flame className="w-3 h-3" /> Trending
                  </Badge>
                )}
                {getTypeBadge()}
              </div>
            </div>
          )}

          {/* Card Title */}
          <h2 className="text-base font-black text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-start justify-between gap-1.5"
            >
              <span>{item.title}</span>
              <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity" />
            </a>
          </h2>

          {/* Movie Details Bar */}
          {item.type === 'movie' && item.movieDetails && (
            <div className="flex flex-wrap items-center gap-3 my-2 text-xs font-bold text-emerald-800/80 dark:text-emerald-300/80">
              {item.movieDetails.rating && (
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  {item.movieDetails.rating}
                </span>
              )}
              {item.movieDetails.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  {item.movieDetails.duration}
                </span>
              )}
              {item.movieDetails.director && (
                <span className="text-emerald-800/60 dark:text-emerald-300/60">Dir: {item.movieDetails.director}</span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="mt-2 text-xs text-emerald-900/70 dark:text-emerald-200/70 line-clamp-3 leading-relaxed font-medium">
            {item.description}
          </p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/50 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3.5 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between gap-2">
          {/* Author Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            {item.author.avatar ? (
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-200 dark:border-emerald-700 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {item.author.name[0]}
              </div>
            )}
            <div className="min-w-0 truncate">
              <p className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 truncate">
                {item.author.name}
              </p>
              <p className="text-[10px] font-semibold text-emerald-700/60 dark:text-emerald-300/60" suppressHydrationWarning>
                {formatDate(item.publishedAt)}
              </p>
            </div>
          </div>

          {/* Engagement Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.metrics.likes !== undefined && (
              <span className="text-[11px] font-bold text-emerald-800/70 dark:text-emerald-300/70 mr-1">
                {formatNumber(item.metrics.likes)}
              </span>
            )}

            <FavoriteButton item={item} />

            {/* Share / External Link */}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-500/15 transition-colors"
                title="Open source"
                aria-label="Open source link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
