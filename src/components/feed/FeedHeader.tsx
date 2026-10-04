'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setTheme, setPreferencesModalOpen, setAddPostModalOpen } from '@/src/store/slices/uiSlice';
import { Button } from '../ui/Button';
import { Sun, Moon, SlidersHorizontal, Plus, Sparkles, LayoutGrid, LayoutList } from 'lucide-react';
import { setLayoutMode } from '@/src/store/slices/uiSlice';

export const FeedHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, layoutMode } = useAppSelector((state) => state.ui);
  const preferences = useAppSelector((state) => state.preferences);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#061c14]/90 backdrop-blur-xl border-b border-emerald-500/15 dark:border-emerald-800/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-600 dark:from-white dark:via-emerald-100 dark:to-emerald-300 bg-clip-text text-transparent">
              PulseStream
            </h1>
            <p className="text-[11px] font-semibold text-emerald-700/70 dark:text-emerald-300/70 hidden sm:block">
              Personalized News, Movies & Community Feed
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Layout Switcher */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-emerald-50 dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800">
            <button
              onClick={() => dispatch(setLayoutMode('grid'))}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setLayoutMode('list'))}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'list'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white'
              }`}
              title="List View"
              aria-label="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Create Post Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(setAddPostModalOpen(true))}
            className="hidden xs:flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Create</span>
          </Button>

          {/* Preferences Button */}
          <Button
            variant="glass"
            size="sm"
            onClick={() => dispatch(setPreferencesModalOpen(true))}
            className="relative gap-1.5 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
            <span className="hidden md:inline">Preferences</span>
            {preferences.selectedCategories.length < 9 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            )}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="rounded-xl"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-emerald-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-800 hover:-rotate-12 transition-transform" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
