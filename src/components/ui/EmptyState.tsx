'use client';

import React from 'react';
import { SearchX, HeartX, Sparkles, RotateCcw, FolderX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type?: 'search' | 'favorites' | 'category' | 'general';
  title?: string;
  description?: string;
  searchQuery?: string;
  category?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  searchQuery,
  category,
  onReset,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <SearchX className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />;
      case 'favorites':
        return <HeartX className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />;
      case 'category':
        return <FolderX className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />;
      default:
        return <Sparkles className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  const getDisplayTitle = () => {
    if (title) return title;
    if (type === 'search') {
      return searchQuery ? `No results found for "${searchQuery}"` : 'No matching results found';
    }
    if (type === 'favorites') {
      return "You haven't saved anything yet.";
    }
    if (type === 'category') {
      return category
        ? `No content available for ${category}`
        : 'No content available for this category.';
    }
    return 'Your feed is currently empty';
  };

  const getDisplayDescription = () => {
    if (description) return description;
    if (type === 'search') {
      return 'Try adjusting your search terms or clearing active filters to discover more items.';
    }
    if (type === 'favorites') {
      return 'Click the heart icon on any news, movie, or community post across your feed to bookmark it here.';
    }
    if (type === 'category') {
      return 'There are currently no items matching this selected category. Try selecting another topic.';
    }
    return 'Check your preference settings to verify categories and media types are enabled.';
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 my-6 rounded-3xl bg-white/50 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800 backdrop-blur-sm max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mb-4 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">{getDisplayTitle()}</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-5 leading-relaxed">
        {getDisplayDescription()}
      </p>

      {onReset && (
        <Button variant="primary" size="sm" onClick={onReset} className="gap-2 font-semibold">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
};

