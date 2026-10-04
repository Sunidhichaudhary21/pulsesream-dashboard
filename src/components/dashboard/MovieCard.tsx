'use client';

import React from 'react';
import { FeedItem } from '@/src/types/content';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Film, Star, Clock, GripVertical, ExternalLink } from 'lucide-react';

interface MovieCardProps {
  item: FeedItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, dragHandleProps }) => {
  const targetUrl = item.url && item.url !== '#' ? item.url : 'https://www.themoviedb.org';

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
            <Badge variant="movie" className="gap-1 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border-emerald-500/40">
              <Film className="w-3 h-3 text-emerald-400" /> Cinema
            </Badge>
          </div>
          {item.movieDetails?.rating && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/25 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>{item.movieDetails.rating} / 10</span>
            </div>
          )}
        </a>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-emerald-700 dark:text-emerald-400">
            <span>{item.category.toUpperCase()}</span>
            {item.movieDetails?.duration && (
              <span className="flex items-center gap-1 text-emerald-700/60 dark:text-emerald-300/60 font-semibold">
                <Clock className="w-3 h-3 text-emerald-500" /> {item.movieDetails.duration}
              </span>
            )}
          </div>
          
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
          {item.movieDetails?.director && (
            <p className="text-[11px] font-semibold text-emerald-800/60 dark:text-emerald-300/60">
              Directed by <span className="text-emerald-950 dark:text-emerald-100 font-bold">{item.movieDetails.director}</span>
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 hover:underline"
          >
            <span>{item.movieDetails?.year || 2026} • Open Movie</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <FavoriteButton item={item} />
        </div>
      </div>
    </article>
  );
};
