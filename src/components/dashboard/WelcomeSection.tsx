'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setPreferencesModalOpen, setAddPostModalOpen } from '@/src/store/slices/uiSlice';
import { Button } from '../ui/Button';
import { Sparkles, SlidersHorizontal, Plus, Bookmark, Activity, Zap, TrendingUp } from 'lucide-react';

export const WelcomeSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-500 p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/15 border border-emerald-400/40 mb-8">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Greeting & Date */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-100">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold">
              📅 {formattedDate}
            </span>
            <span className="flex items-center gap-1 text-white font-extrabold">
              <Zap className="w-3.5 h-3.5 fill-white text-white" /> AI Engine Active
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Welcome back, <span className="text-white underline underline-offset-4 decoration-emerald-200">Alex!</span> 👋
          </h2>

          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
            Your personalized stream has <span className="text-white font-extrabold underline underline-offset-4">12 fresh articles</span> and <span className="text-white font-extrabold underline underline-offset-4">3 trending film recommendations</span> tailored to your interests.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="glass"
            size="sm"
            onClick={() => dispatch(setPreferencesModalOpen(true))}
            className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
            <span>Customize Stream</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setAddPostModalOpen(true))}
            className="gap-2 font-extrabold bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4 stroke-[3] text-emerald-700" />
            <span>Create Content</span>
          </Button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/25">
        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/25 text-white">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white">{favoriteIds.length}</p>
            <p className="text-[10px] text-emerald-100 font-bold">Saved Items</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/25 text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white">{preferences.selectedCategories.length}</p>
            <p className="text-[10px] text-emerald-100 font-bold">Active Categories</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/25 text-white">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white">98.4%</p>
            <p className="text-[10px] text-emerald-100 font-bold">Match Score</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/25 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Live</p>
            <p className="text-[10px] text-emerald-100 font-bold">RTK Stream</p>
          </div>
        </div>
      </div>
    </section>
  );
};
