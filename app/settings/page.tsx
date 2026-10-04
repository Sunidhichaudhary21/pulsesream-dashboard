'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { updatePreferences, resetPreferences } from '@/src/store/slices/preferencesSlice';
import { setSidebarTab, setTheme } from '@/src/store/slices/uiSlice';
import { preferenceFormSchema, PreferenceFormValues, categoriesEnum, contentTypesEnum } from '@/src/lib/validators';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { Header } from '@/src/components/dashboard/Header';
import { MobileNav } from '@/src/components/dashboard/MobileNav';
import { Button } from '@/src/components/ui/Button';
import { ContentCategory, ContentType } from '@/src/types/content';
import {
  Settings,
  Check,
  RotateCcw,
  Save,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Clock,
  LayoutGrid,
  Sun,
  Moon,
} from 'lucide-react';

const CATEGORY_META: Record<ContentCategory, { label: string; description: string; icon: string }> = {
  technology: { label: 'Technology', description: 'Quantum, AI, Hardware, Engineering', icon: '💻' },
  business: { label: 'Business', description: 'Markets, Strategy, Startups, Leadership', icon: '💼' },
  finance: { label: 'Finance & Crypto', description: 'Stock markets, DeFi, Global Economy', icon: '📈' },
  sports: { label: 'Sports & Athletics', description: 'Tournaments, League updates, Fitness', icon: '⚽' },
  science: { label: 'Science & Cosmos', description: 'Physics, Astronomy, NASA, Discoveries', icon: '🧪' },
  entertainment: { label: 'Entertainment', description: 'Pop culture, Music, Media, Celebrities', icon: '🎬' },
  health: { label: 'Health & Wellness', description: 'Biotech, Nutrition, Medical breakthroughs', icon: '🩺' },
  movies: { label: 'Cinema & Movies', description: 'Film releases, Reviews, Directors', icon: '🍿' },
  scifi: { label: 'Sci-Fi & Cyberpunk', description: 'Futuristic themes, Space exploration', icon: '🚀' },
  action: { label: 'Action & Thrillers', description: 'High-octane cinema & Stunts', icon: '💥' },
  gaming: { label: 'Gaming & Esports', description: 'Build guides, Releases, Tournaments', icon: '🎮' },
  design: { label: 'Design & UX', description: 'CSS, Motion tokens, UI systems', icon: '🎨' },
  general: { label: 'General News', description: 'Global headlines and daily briefing', icon: '📰' },
};

const TYPE_META: Record<ContentType, { label: string; description: string }> = {
  news: { label: 'News Articles', description: 'Curated journalism and industry breaking news' },
  movie: { label: 'Movie Recommendations', description: 'Rating guides and cinema recommendations' },
  social: { label: 'Community Posts', description: 'User guides, discussions, and technical updates' },
};

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  // Client-side hydration safety check
  const [isMounted, setIsMounted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(setSidebarTab('settings'));
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceFormSchema),
    defaultValues: preferences,
  });

  useEffect(() => {
    if (isMounted) {
      reset(preferences);
    }
  }, [isMounted, preferences, reset]);

  const onSubmit = (data: PreferenceFormValues) => {
    dispatch(updatePreferences(data));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    dispatch(resetPreferences());
    reset(preferences);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch on SSR
  }

  return (
    <div className="flex h-screen w-full bg-[#f4faf6] dark:bg-[#04100c] text-emerald-950 dark:text-emerald-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Header />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 lg:pb-12">
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-emerald-500/15 dark:border-emerald-800/30 pb-5">
            <div>
              <h1 className="text-2xl font-black text-emerald-950 dark:text-white tracking-tight flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-emerald-600" />
                <span>Dashboard Settings & Preferences</span>
              </h1>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 font-medium mt-1">
                Customize your interest categories, preferred content streams, auto-refresh frequency, and layout density.
              </p>
            </div>
            {saveSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Preferences Saved!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Category Selection Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Select Interest Categories</span>
                  </h2>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 font-medium">
                    Choose one or more topics to personalize your unified feed algorithm.
                  </p>
                </div>
              </div>

              <Controller
                name="selectedCategories"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categoriesEnum.map((category) => {
                      const isChecked = field.value.includes(category);
                      const meta = CATEGORY_META[category] || {
                        label: category,
                        description: 'Custom topic',
                        icon: '📌',
                      };
                      return (
                        <button
                          type="button"
                          key={category}
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={() => {
                            if (isChecked) {
                              if (field.value.length > 1) {
                                field.onChange(field.value.filter((c) => c !== category));
                              }
                            } else {
                              field.onChange([...field.value, category]);
                            }
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all relative group ${
                            isChecked
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                              : 'bg-white dark:bg-[#0b271d] border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900/80 dark:text-emerald-300/80 hover:border-emerald-400'
                          }`}
                        >
                          <span className="text-xl flex-shrink-0">{meta.icon}</span>
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-xs font-black text-emerald-950 dark:text-emerald-50 truncate">
                              {meta.label}
                            </p>
                            <p className="text-[10px] text-emerald-800/60 dark:text-emerald-300/60 font-semibold line-clamp-1 mt-0.5">
                              {meta.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors absolute top-3.5 right-3.5 ${
                              isChecked
                                ? 'bg-emerald-600 text-white'
                                : 'border border-emerald-300 dark:border-emerald-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.selectedCategories && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{errors.selectedCategories.message}</p>
              )}
            </section>

            {/* 2. Content Types Section */}
            <section className="space-y-4 pt-6 border-t border-emerald-500/15 dark:border-emerald-800/30">
              <div>
                <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Content Types</span>
                </h2>
                <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70 font-medium">
                  Select which media formats are included in your personalized stream.
                </p>
              </div>

              <Controller
                name="contentTypes"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {contentTypesEnum.map((type) => {
                      const isChecked = field.value.includes(type);
                      const meta = TYPE_META[type];
                      return (
                        <button
                          type="button"
                          key={type}
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={() => {
                            if (isChecked) {
                              if (field.value.length > 1) {
                                field.onChange(field.value.filter((t) => t !== type));
                              }
                            } else {
                              field.onChange([...field.value, type]);
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isChecked
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                              : 'bg-white dark:bg-[#0b271d] border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900/80 dark:text-emerald-300/80 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-emerald-950 dark:text-emerald-50">
                              {meta.label}
                            </span>
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center ${
                                isChecked ? 'bg-emerald-600 text-white' : 'border border-emerald-300 dark:border-emerald-700'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-emerald-800/60 dark:text-emerald-300/60 font-semibold leading-relaxed">
                            {meta.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </section>

            {/* 3. Layout & Theme Preferences */}
            <section className="space-y-4 pt-6 border-t border-emerald-500/15 dark:border-emerald-800/30">
              <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <span>Appearance & Stream Controls</span>
              </h2>

              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                  Interface Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'Dark Mode', icon: Moon },
                    { id: 'light', label: 'Light Mode', icon: Sun },
                    { id: 'system', label: 'Match System', icon: Sparkles },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = useAppSelector((state) => state.ui.theme) === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => dispatch(setTheme(t.id as any))}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                            : 'bg-white dark:bg-[#0b271d] border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 hover:border-emerald-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                    Auto-Refresh Interval
                  </label>
                  <Controller
                    name="refreshInterval"
                    control={control}
                    render={({ field }) => (
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <option value={0}>Disabled (Manual refresh)</option>
                        <option value={30}>Every 30 Seconds</option>
                        <option value={60}>Every 1 Minute</option>
                        <option value={300}>Every 5 Minutes</option>
                      </select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                    Layout Density
                  </label>
                  <Controller
                    name="layoutDensity"
                    control={control}
                    render={({ field }) => (
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        <option value="comfortable">Comfortable Grid (3 Column)</option>
                        <option value="compact">Compact Grid (Dense)</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Save & Reset Action Bar */}
            <div className="pt-6 border-t border-emerald-500/15 dark:border-emerald-800/30 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetDefaults}
                className="gap-2 text-emerald-700 dark:text-emerald-300 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="gap-2 font-bold shadow-lg shadow-emerald-600/25 px-6"
              >
                <Save className="w-4 h-4" />
                <span>Save & Apply Preferences</span>
              </Button>
            </div>
          </form>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
