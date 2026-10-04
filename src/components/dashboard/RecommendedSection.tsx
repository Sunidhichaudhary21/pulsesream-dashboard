'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleFavorite } from '@/src/store/slices/favoritesSlice';
import { SectionHeader } from './SectionHeader';
import { ContentCard } from './ContentCard';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { setPreferencesModalOpen } from '@/src/store/slices/uiSlice';

export const RecommendedSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const preferences = useAppSelector((state) => state.preferences);

  const recommendedItems = INITIAL_MOCK_FEED.filter(
    (item) => preferences.selectedCategories.includes(item.category)
  ).slice(0, 3);

  return (
    <section className="my-8">
      <SectionHeader
        title="Recommended for You"
        subtitle="Hand-picked content based on your selected interests in Sci-Fi, Tech, & Cinema."
        icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
        action={
          <button
            onClick={() => dispatch(setPreferencesModalOpen(true))}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tune Engine</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedItems.map((item) => (
          <ContentCard
            key={`rec-${item.id}`}
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          />
        ))}
      </div>
    </section>
  );
};
