'use client';

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useGetFeedQuery } from '@/src/store/api/contentApi';
import { toggleFavorite } from '@/src/store/slices/favoritesSlice';
import { setCustomOrder, reorderItems } from '@/src/store/slices/customOrderSlice';
import { resetFilters, setActiveTab } from '@/src/store/slices/uiSlice';
import { setFeed, appendFeed, reorderFeed, toggleInfiniteScroll } from '@/src/store/slices/feedSlice';
import { SortableFeedCard } from './SortableFeedCard';
import { FeedCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { Button } from '../ui/Button';
import { Loader2, RefreshCw, ChevronDown, CheckCircle2, AlertTriangle, Infinity } from 'lucide-react';
import { ContentItem } from '@/src/types/content';

const PAGE_SIZE = 9;

export const FeedContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, categoryFilter, typeFilter, activeTab, layoutMode } = useAppSelector(
    (state) => state.ui
  );
  const preferences = useAppSelector((state) => state.preferences);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const orderedIds = useAppSelector((state) => state.customOrder.orderedIds);

  const [page, setPage] = useState<number>(1);
  const [accumulatedItems, setAccumulatedItems] = useState<ContentItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState<boolean>(true);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // Setup Sensors for dnd-kit drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Effective type filter
  const effectiveType =
    activeTab === 'news' || activeTab === 'movie' || activeTab === 'social' ? activeTab : typeFilter;

  // Reset pagination when active filters change
  useEffect(() => {
    setPage(1);
    setAccumulatedItems([]);
  }, [searchQuery, categoryFilter, effectiveType, activeTab, preferences.selectedCategories, preferences.contentTypes]);

  // Query feed data from API / RTK Query
  const { data, isLoading, isError, error, refetch, isFetching } = useGetFeedQuery(
    {
      query: searchQuery,
      category: categoryFilter,
      type: effectiveType,
      trending: activeTab === 'trending',
      categories: preferences.selectedCategories,
      types: preferences.contentTypes,
      page,
      pageSize: PAGE_SIZE,
    },
    {
      pollingInterval: preferences.refreshInterval ? preferences.refreshInterval * 1000 : 0,
    }
  );

  // Synchronize incoming page data with accumulated state (prevent duplicates!)
  useEffect(() => {
    if (!data) return;

    setTotalItems(data.total);

    if (page === 1) {
      setAccumulatedItems(data.items);
      dispatch(setFeed({ items: data.items, total: data.total }));
    } else {
      setAccumulatedItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newUniqueItems = data.items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newUniqueItems];
      });

      // Dispatch side effect safely in useEffect
      const existingIds = new Set(accumulatedItems.map((item) => item.id));
      const newUniqueItems = data.items.filter((item) => !existingIds.has(item.id));
      if (newUniqueItems.length > 0) {
        dispatch(appendFeed({ items: newUniqueItems, total: data.total, page }));
      }
    }
  }, [data, page, dispatch]);

  const hasMore = accumulatedItems.length < totalItems;

  // Handler to load next page
  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // Setup IntersectionObserver for optional Infinite Scrolling
  useEffect(() => {
    if (!isInfiniteScroll || !hasMore || isFetching || isLoading || isError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isInfiniteScroll, hasMore, isFetching, isLoading, isError, handleLoadMore]);

  // Filter items locally for 'favorites' tab & custom ordering
  const displayItems = useMemo(() => {
    let items = [...accumulatedItems];

    if (activeTab === 'favorites') {
      items = items.filter((item) => favoriteIds.includes(item.id));
    }

    if (orderedIds.length > 0 && activeTab === 'all' && !searchQuery) {
      const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
      items.sort((a, b) => {
        const indexA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 9999;
        const indexB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 9999;
        return indexA - indexB;
      });
    }

    return items;
  }, [accumulatedItems, activeTab, favoriteIds, orderedIds, searchQuery]);

  // Sync item IDs to custom order slice if empty
  useEffect(() => {
    if (accumulatedItems.length > 0 && orderedIds.length === 0) {
      dispatch(setCustomOrder(accumulatedItems.map((i) => i.id)));
    }
  }, [accumulatedItems, orderedIds.length, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      dispatch(reorderItems({ activeId, overId }));
      dispatch(reorderFeed({ activeId, overId }));
    }
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleResetAllFilters = () => {
    dispatch(resetFilters());
    dispatch(setActiveTab('all'));
  };

  // Initial Loading State (Page 1)
  if (isLoading && page === 1) {
    return (
      <div
        className={`grid gap-6 ${
          layoutMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <FeedCardSkeleton key={i} layoutMode={layoutMode} />
        ))}
      </div>
    );
  }

  // Initial Error State (Page 1 failed completely)
  if (isError && page === 1 && accumulatedItems.length === 0) {
    return (
      <ErrorState
        message={
          typeof error === 'object' && error && 'data' in error
            ? JSON.stringify((error as any).data)
            : 'Unable to fetch personalized feed data.'
        }
        onRetry={() => refetch()}
      />
    );
  }

  // Empty State
  if (!isLoading && displayItems.length === 0) {
    if (activeTab === 'favorites') {
      return <EmptyState type="favorites" title="You haven't saved anything yet." />;
    }
    if (searchQuery) {
      return <EmptyState type="search" searchQuery={searchQuery} onReset={handleResetAllFilters} />;
    }
    if (categoryFilter !== 'all') {
      return (
        <EmptyState
          type="category"
          category={categoryFilter}
          title={`No content available for "${categoryFilter}"`}
          onReset={handleResetAllFilters}
        />
      );
    }
    return <EmptyState type="general" onReset={handleResetAllFilters} />;
  }

  return (
    <div className="w-full relative space-y-8">
      {/* Background Fetching Toast Indicator */}
      {isFetching && page === 1 && (
        <div className="fixed bottom-6 right-6 z-40 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Updating Feed...
        </div>
      )}

      {/* Feed Toolbar / Infinite Scroll Switch */}
      <div className="flex items-center justify-between text-xs text-emerald-800/70 dark:text-emerald-300/70 px-1 border-b border-emerald-500/15 dark:border-emerald-800/30 pb-3">
        <div className="flex items-center gap-2 font-semibold">
          <span>Displaying <strong className="text-emerald-950 dark:text-emerald-100">{displayItems.length}</strong> of <strong className="text-emerald-950 dark:text-emerald-100">{totalItems}</strong> items</span>
          {activeTab === 'favorites' && <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">(Saved Favorites)</span>}
        </div>

        <button
          type="button"
          onClick={() => setIsInfiniteScroll((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-bold ${
            isInfiniteScroll
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
              : 'bg-emerald-50 dark:bg-[#0b271d] text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}
          title="Toggle automatic loading on scroll"
        >
          <Infinity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Auto-Scroll: {isInfiniteScroll ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Drag & Drop Card Grid Context */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={displayItems.map((item) => item.id)}
          strategy={layoutMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
        >
          <div
            className={`grid gap-6 transition-all ${
              layoutMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {displayItems.map((item) => (
              <SortableFeedCard
                key={item.id}
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Pagination Load More Controls */}
      {activeTab !== 'favorites' && (
        <div className="flex flex-col items-center justify-center pt-6 pb-2 space-y-4">
          {/* Failure Banner on Next Page Fetch (Preserves existing items!) */}
          {isError && page > 1 && (
            <div className="w-full max-w-md p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Failed to load page {page}. Existing items are safe.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-xs shrink-0 gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {hasMore ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-8 py-3 rounded-xl border-emerald-300 dark:border-emerald-700 font-extrabold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/80 shadow-sm transition-all flex items-center gap-2 group text-emerald-950 dark:text-emerald-100"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span>Loading Next Page...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Content</span>
                    <ChevronDown className="w-4 h-4 text-emerald-500 group-hover:translate-y-0.5 transition-transform" />
                  </>
                )}
              </Button>

              <span className="text-[11px] text-emerald-800/60 dark:text-emerald-300/60 font-semibold">
                Page {page} • Loaded {accumulatedItems.length} of {totalItems} items
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 py-3 bg-white dark:bg-[#0b271d] px-6 rounded-full border border-emerald-200/80 dark:border-emerald-800/70 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>You've reached the end of the feed ({totalItems} items total)</span>
            </div>
          )}

          {/* Observer Target Sentinel for Infinite Scrolling */}
          <div ref={observerTargetRef} className="h-4 w-full pointer-events-none opacity-0" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

