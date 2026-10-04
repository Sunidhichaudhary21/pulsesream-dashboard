'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setSidebarTab, setCategoryFilter, setPreferencesModalOpen } from '@/src/store/slices/uiSlice';
import { SidebarNavTab, ContentCategory } from '@/src/types/content';
import {
  LayoutDashboard,
  Flame,
  Heart,
  Settings,
  Sparkles,
  Sliders,
  Cpu,
  Film,
  Compass,
  Radio,
  Gamepad2,
  Palette,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: SidebarNavTab;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebarTab = useAppSelector((state) => state.ui.sidebarTab);
  const categoryFilter = useAppSelector((state) => state.ui.categoryFilter);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4 text-emerald-500" />, badge: 'Hot' },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Heart className="w-4 h-4 text-emerald-500" />,
      badge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const categoryItems: { id: ContentCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'technology', label: 'Technology', icon: <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'movies', label: 'Cinema & Film', icon: <Film className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'scifi', label: 'Sci-Fi & Cosmos', icon: <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'gaming', label: 'Gaming & Esports', icon: <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'design', label: 'Design & UX', icon: <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-emerald-100 p-4 justify-between select-none z-30 transition-colors">
      {/* Top Branding Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-emerald-950 flex items-center gap-1">
              PulseStream
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-emerald-700 font-semibold">Green & White Studio</p>
          </div>
        </div>

        {/* Primary Nav Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-800/60 mb-2">
            Main Navigation
          </p>
          {mainNavItems.map((item) => {
            const isActive = sidebarTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'settings') {
                    dispatch(setPreferencesModalOpen(true));
                  } else {
                    dispatch(setSidebarTab(item.id));
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-800'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white text-emerald-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Filters Menu */}
        <div className="space-y-1 pt-3 border-t border-emerald-100">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-800/60 mb-2">
            Categories
          </p>
          {categoryItems.map((cat) => {
            const isCatActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  dispatch(setSidebarTab('dashboard'));
                  dispatch(setCategoryFilter(isCatActive ? 'all' : cat.id));
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCatActive
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </div>
                {isCatActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Storage / Quick Preferences Widget */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-emerald-950 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Live Sync Active
          </span>
          <button
            onClick={() => dispatch(setPreferencesModalOpen(true))}
            className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-950 transition-colors"
            title="Open Preferences"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-emerald-800 font-medium">Green & White theme engine running smoothly.</p>
      </div>
    </aside>
  );
};
