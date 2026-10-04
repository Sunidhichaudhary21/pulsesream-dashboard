'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { updatePreferences, resetPreferences } from '@/src/store/slices/preferencesSlice';
import { setPreferencesModalOpen } from '@/src/store/slices/uiSlice';
import { preferenceFormSchema, PreferenceFormValues, categoriesEnum, contentTypesEnum } from '@/src/lib/validators';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ContentCategory, ContentType } from '@/src/types/content';
import { Check, RotateCcw, Sliders, CheckSquare, Square } from 'lucide-react';

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  technology: 'Technology',
  business: 'Business',
  finance: 'Finance & Crypto',
  sports: 'Sports & Athletics',
  entertainment: 'Entertainment',
  health: 'Health & Wellness',
  movies: 'Cinema & Movies',
  scifi: 'Sci-Fi & Space',
  action: 'Action & Thrillers',
  gaming: 'Gaming & Esports',
  science: 'Science & Cosmos',
  design: 'Design & UX',
  general: 'General News',
};

const TYPE_LABELS: Record<ContentType, string> = {
  news: 'News Articles',
  movie: 'Movie Recommendations',
  social: 'Community Posts',
};

export const PreferencesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isPreferencesModalOpen);
  const preferences = useAppSelector((state) => state.preferences);

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
    if (isOpen) {
      reset(preferences);
    }
  }, [isOpen, preferences, reset]);

  const handleClose = () => {
    dispatch(setPreferencesModalOpen(false));
  };

  const onSubmit = (data: PreferenceFormValues) => {
    dispatch(updatePreferences(data));
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    reset(preferences);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Content Preferences"
      description="Customize your personalized feed categories, content types, and layout density."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {/* Category Selection Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
            Selected Categories
          </label>
          <Controller
            name="selectedCategories"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoriesEnum.map((category) => {
                  const isChecked = field.value.includes(category);
                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() => {
                        if (isChecked) {
                          if (field.value.length > 1) {
                            field.onChange(field.value.filter((c) => c !== category));
                          }
                        } else {
                          field.onChange([...field.value, category]);
                        }
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        isChecked
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'bg-emerald-50/50 dark:bg-[#0b271d]/50 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900/80 dark:text-emerald-300/80 hover:border-emerald-400'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'border border-emerald-300 dark:border-emerald-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{CATEGORY_LABELS[category]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.selectedCategories && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{errors.selectedCategories.message}</p>
          )}
        </div>

        {/* Content Type Toggles */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
            Content Types
          </label>
          <Controller
            name="contentTypes"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {contentTypesEnum.map((type) => {
                  const isChecked = field.value.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => {
                        if (isChecked) {
                          if (field.value.length > 1) {
                            field.onChange(field.value.filter((t) => t !== type));
                          }
                        } else {
                          field.onChange([...field.value, type]);
                        }
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isChecked
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'bg-emerald-50/50 dark:bg-[#0b271d]/50 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900/80 dark:text-emerald-300/80 hover:border-emerald-400'
                      }`}
                    >
                      <span>{TYPE_LABELS[type]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.contentTypes && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{errors.contentTypes.message}</p>
          )}
        </div>

        {/* Refresh Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
              Auto-Refresh Timer
            </label>
            <Controller
              name="refreshInterval"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value={0}>Disabled</option>
                  <option value={30}>Every 30 Seconds</option>
                  <option value={60}>Every 1 Minute</option>
                  <option value={300}>Every 5 Minutes</option>
                </select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
              Display Density
            </label>
            <Controller
              name="layoutDensity"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-xl bg-white dark:bg-[#0b271d] border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 text-xs font-bold px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="comfortable">Comfortable Grid</option>
                  <option value="compact">Compact Grid</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-emerald-700 dark:text-emerald-300">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
