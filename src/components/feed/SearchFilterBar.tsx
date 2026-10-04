'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  setActiveTab,
  setSearchQuery,
  setCategoryFilter,
  setTypeFilter,
  resetFilters,
} from '@/src/store/slices/uiSlice';
import { useDebounce } from '@/src/hooks/useDebounce';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { ContentCategory, FeedTab } from '@/src/types/content';
import { Search, X, Flame, Heart, Newspaper, Film, MessageSquare, Filter, RefreshCw } from 'lucide-react';

const TABS: { id: FeedTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Feed', icon: <Filter className="w-3.5 h-3.5" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'movie', label: 'Movies', icon: <Film className="w-3.5 h-3.5 text-green-500" /> },
  { id: 'social', label: 'Social', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'trending', label: 'Trending', icon: <Flame className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart className="w-3.5 h-3.5 text-emerald-500" /> },
];

const CATEGORIES: { id: ContentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'technology', label: 'Tech' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'movies', label: 'Cinema' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'action', label: 'Action' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'science', label: 'Science' },
  { id: 'design', label: 'Design' },
];

export const SearchFilterBar: React.FC<{ onRefetch?: () => void }> = ({ onRefetch }) => {
  const dispatch = useAppDispatch();
  const { activeTab, searchQuery, categoryFilter } = useAppSelector((state) => state.ui);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync debounced search with Redux state
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleClearSearch = () => {
    setLocalSearch('');
    dispatch(setSearchQuery(''));
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || activeTab !== 'all';

  return (
    <div className="w-full space-y-4 my-6">
      {/* Search Input & Category Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Debounced Search Box */}
        <div className="flex-1 relative">
          <Input
            placeholder="Search news, movies, posts, topics, or authors..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            rightElement={
              localSearch ? (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null
            }
          />
        </div>

        {/* Category Pill / Select dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <select
            value={categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value as ContentCategory | 'all'))}
            className="rounded-2xl bg-white border border-emerald-200 text-emerald-950 text-xs font-extrabold px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 cursor-pointer shadow-sm hover:border-emerald-300"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          {onRefetch && (
            <button
              onClick={onRefetch}
              className="p-2.5 rounded-2xl bg-white border border-emerald-200 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm"
              title="Refresh Feed"
              aria-label="Refresh feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => {
                handleClearSearch();
                dispatch(resetFilters());
                dispatch(setActiveTab('all'));
              }}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1 whitespace-nowrap border border-emerald-200/60"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-emerald-100">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-2xl transition-all select-none whitespace-nowrap relative ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-50/70 text-emerald-900 border border-emerald-200/70 hover:bg-emerald-100 hover:text-emerald-950'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'favorites' && favoriteIds.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white text-emerald-800' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {favoriteIds.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
