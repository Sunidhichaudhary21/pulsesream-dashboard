'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleFavorite } from '@/src/store/slices/favoritesSlice';
import { SectionHeader } from './SectionHeader';
import { ContentCard } from './ContentCard';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { Flame, ArrowRight } from 'lucide-react';
import { setActiveTab } from '@/src/store/slices/uiSlice';

export const TrendingSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const trendingItems = INITIAL_MOCK_FEED.filter((item) => item.isTrending).slice(0, 3);

  return (
    <section className="my-8">
      <SectionHeader
        title="Trending Today"
        subtitle="Most active quantum, film, and community topics across PulseStream."
        icon={<Flame className="w-4 h-4 text-emerald-500" />}
        action={
          <button
            onClick={() => dispatch(setActiveTab('trending'))}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingItems.map((item) => (
          <ContentCard
            key={`trending-${item.id}`}
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          />
        ))}
      </div>
    </section>
  );
};
