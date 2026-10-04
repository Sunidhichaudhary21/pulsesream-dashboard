'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { clearFavorites } from '@/src/store/slices/favoritesSlice';
import { setSidebarTab } from '@/src/store/slices/uiSlice';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { Header } from '@/src/components/dashboard/Header';
import { MobileNav } from '@/src/components/dashboard/MobileNav';
import { ContentCard } from '@/src/components/dashboard/ContentCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Button } from '@/src/components/ui/Button';
import { Heart, Trash2, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { ContentItem } from '@/src/types/content';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { favoriteIds, favorites } = useAppSelector((state) => state.favorites);
  const layoutMode = useAppSelector((state) => state.ui.layoutMode);

  // Client hydration check
  const [isMounted, setIsMounted] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'news' | 'movie' | 'social'>('all');

  useEffect(() => {
    setIsMounted(true);
    dispatch(setSidebarTab('favorites'));
  }, [dispatch]);

  // Combine full favorite items from state and fallback matching in mock feed
  const displayFavorites = React.useMemo(() => {
    const itemsMap = new Map<string, ContentItem>();
    
    // Add items from favorites array in Redux
    favorites.forEach((item) => itemsMap.set(item.id, item));
    
    // Also match IDs in mock feed for complete metadata
    INITIAL_MOCK_FEED.forEach((item) => {
      if (favoriteIds.includes(item.id)) {
        itemsMap.set(item.id, item);
      }
    });

    let result = Array.from(itemsMap.values());

    if (filterType !== 'all') {
      result = result.filter((item) => item.type === filterType);
    }

    return result;
  }, [favoriteIds, favorites, filterType]);

  if (!isMounted) {
    return null; // Prevent SSR hydration mismatch
  }

  return (
    <div className="flex h-screen w-full bg-[#f4faf6] dark:bg-[#04100c] text-emerald-950 dark:text-emerald-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 lg:pb-12">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/15 dark:border-emerald-800/30 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                <span>Personal Collection</span>
              </div>
              <h1 className="text-2xl font-black text-emerald-950 dark:text-white tracking-tight">
                Saved Favorites ({favoriteIds.length})
              </h1>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 font-medium mt-1">
                Access all your bookmarked news articles, cinema recommendations, and community posts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Feed</span>
                </Button>
              </Link>

              {favoriteIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearFavorites())}
                  className="gap-1.5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 font-bold"
                >
                  <Trash2 className="w-4 h-4 text-emerald-600" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>

          {/* Content Type Filter Pills */}
          {favoriteIds.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-emerald-800/60 dark:text-emerald-300/60 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-500" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'news', label: 'News' },
                { id: 'movie', label: 'Movies' },
                { id: 'social', label: 'Community' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterType === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#0b271d] text-emerald-900/80 dark:text-emerald-200/80 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Favorites Grid / Empty State */}
          {displayFavorites.length > 0 ? (
            <div
              className={`grid gap-6 transition-all ${
                layoutMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {displayFavorites.map((item) => (
                <ContentCard
                  key={`fav-${item.id}`}
                  item={item}
                  isFavorite={true}
                  onToggleFavorite={() => {}}
                  layoutMode={layoutMode}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="favorites"
              title={favoriteIds.length === 0 ? 'No favorites saved yet' : 'No matching favorites in this type'}
              description="Click the heart icon on any news, movie recommendation, or social post across your feed to save it here."
            />
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
