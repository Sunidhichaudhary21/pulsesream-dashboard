'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { toggleFavorite } from '@/src/store/slices/favoritesSlice';
import { SectionHeader } from './SectionHeader';
import { SocialCard } from './SocialCard';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { MessageSquare, Plus } from 'lucide-react';
import { setAddPostModalOpen } from '@/src/store/slices/uiSlice';

export const SocialPulseSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const socialItems = INITIAL_MOCK_FEED.filter((item) => item.type === 'social').slice(0, 3);

  return (
    <section className="my-8">
      <SectionHeader
        title="Social Pulse"
        subtitle="Discussions, benchmark guides, and open-source updates from top engineers and creators."
        icon={<MessageSquare className="w-4 h-4 text-emerald-500" />}
        action={
          <button
            onClick={() => dispatch(setAddPostModalOpen(true))}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Join Discussion</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socialItems.map((item) => (
          <SocialCard
            key={`social-${item.id}`}
            item={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          />
        ))}
      </div>
    </section>
  );
};
