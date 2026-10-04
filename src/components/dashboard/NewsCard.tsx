'use client';

import React from 'react';
import { FeedItem } from '@/src/types/content';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { formatDate, formatNumber } from '@/src/lib/utils';
import { Newspaper, Eye, GripVertical, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: FeedItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, dragHandleProps }) => {
  const targetUrl = item.url && item.url !== '#' ? item.url : 'https://news.google.com';

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#0b261c] border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-500/80 dark:hover:border-emerald-400 shadow-sm hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 overflow-hidden h-full">
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white/80 hover:text-white cursor-grab active:cursor-grabbing opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md touch-none"
          title="Drag card to reorder"
          aria-label="Drag card to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {item.imageUrl && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-44 overflow-hidden bg-emerald-950 block group/img cursor-pointer"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent" />
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="news" className="gap-1 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border-emerald-500/40">
              <Newspaper className="w-3 h-3 text-emerald-400" /> News
            </Badge>
          </div>
          {item.newsSource && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-lg bg-white/25 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20">
                {item.newsSource.name}
              </span>
            </div>
          )}
        </a>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {item.category}
          </span>
          <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
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
          <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70 line-clamp-2 leading-relaxed font-medium">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.author.avatar ? (
              <img src={item.author.avatar} alt={item.author.name} className="w-6 h-6 rounded-full object-cover border border-emerald-200 dark:border-emerald-700" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                {item.author.name[0]}
              </div>
            )}
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 truncate max-w-[100px]">
              {item.author.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.metrics.views && (
              <span className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-300/60 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-500" /> {formatNumber(item.metrics.views)}
              </span>
            )}
            <FavoriteButton item={item} />
          </div>
        </div>
      </div>
    </article>
  );
};
