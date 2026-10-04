'use client';

import React from 'react';
import { FeedItem } from '@/src/types/content';
import { FavoriteButton } from '../ui/FavoriteButton';
import { formatDate, formatNumber } from '@/src/lib/utils';
import { Heart, MessageCircle, GripVertical, ExternalLink } from 'lucide-react';

interface SocialCardProps {
  item: FeedItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

export const SocialCard: React.FC<SocialCardProps> = ({ item, dragHandleProps }) => {
  const targetUrl = item.url && item.url !== '#' ? item.url : 'https://dev.to';

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#0b261c] border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-500/80 dark:hover:border-emerald-400 shadow-sm hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 p-5 h-full justify-between">
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 cursor-grab active:cursor-grabbing opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm touch-none"
          title="Drag card to reorder"
          aria-label="Drag card to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-3">
          {item.author.avatar ? (
            <img src={item.author.avatar} alt={item.author.name} className="w-9 h-9 rounded-full object-cover border border-emerald-200 dark:border-emerald-700" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {item.author.name[0]}
            </div>
          )}
          <div>
            <p className="text-xs font-extrabold text-emerald-950 dark:text-emerald-50 leading-tight">
              {item.author.name}
            </p>
            <p className="text-[10px] text-emerald-800/60 dark:text-emerald-300/60 font-semibold" suppressHydrationWarning>
              {item.author.handle || '@community'} • <span suppressHydrationWarning>{formatDate(item.publishedAt)}</span>
            </p>
          </div>
        </div>

        <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug mb-1.5">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-start justify-between gap-1.5"
          >
            <span>{item.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </a>
        </h3>
        <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70 line-clamp-3 leading-relaxed font-medium mb-3">
          {item.description}
        </p>

        {item.imageUrl && (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-emerald-950 block group/img cursor-pointer"
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
          </a>
        )}
      </div>

      <div className="pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-800/70 dark:text-emerald-300/70 font-semibold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            <Heart className="w-3.5 h-3.5 text-emerald-500" /> {formatNumber(item.metrics.likes)}
          </span>
          <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> {formatNumber(item.metrics.commentsCount || 12)}
          </span>
        </div>

        <FavoriteButton item={item} />
      </div>
    </article>
  );
};
