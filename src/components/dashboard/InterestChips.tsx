'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setCategoryFilter, setSelectedTag } from '@/src/store/slices/uiSlice';
import { ContentCategory } from '@/src/types/content';
import { Hash, Sparkles, X, Filter } from 'lucide-react';

export const InterestChips: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTag = useAppSelector((state) => state.ui.selectedTag);
  const categoryFilter = useAppSelector((state) => state.ui.categoryFilter);
  const preferences = useAppSelector((state) => state.preferences);

  return (
    <div className="w-full my-4 space-y-2">
      {/* Active User Interest Categories Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950 pr-2 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Your Interests:</span>
        </div>

        {preferences.selectedCategories.map((category) => {
          const isCategorySelected = categoryFilter === category;
          const label = category.charAt(0).toUpperCase() + category.slice(1);
          return (
            <button
              key={`pref-chip-${category}`}
              onClick={() => dispatch(setCategoryFilter(isCategorySelected ? 'all' : category))}
              aria-pressed={isCategorySelected}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
                isCategorySelected
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500 font-black'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200/90 hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs font-extrabold'
              }`}
            >
              <span>{label}</span>
              {isCategorySelected && <X className="w-3 h-3 ml-0.5 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
