'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setMobileSidebarOpen, setSidebarTab, setPreferencesModalOpen } from '@/src/store/slices/uiSlice';
import { SidebarNavTab } from '@/src/types/content';
import {
  LayoutDashboard,
  Flame,
  Heart,
  Settings,
  X,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isMobileSidebarOpen, sidebarTab } = useAppSelector((state) => state.ui);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const navItems: { id: SidebarNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'trending', label: 'Trending', icon: <Flame className="w-5 h-5 text-emerald-500" /> },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Heart className="w-5 h-5 text-emerald-500" />,
      badge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#061c14] border-r border-emerald-500/15 dark:border-emerald-800/30 p-6 flex flex-col justify-between z-10 shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-400 flex items-center justify-center text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-base text-emerald-950 dark:text-white">PulseStream</span>
                  </div>
                  <button
                    onClick={() => dispatch(setMobileSidebarOpen(false))}
                    className="p-2 rounded-xl text-emerald-600 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 pt-4 border-t border-emerald-100 dark:border-emerald-800/50">
                  {navItems.map((item) => {
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
                          dispatch(setMobileSidebarOpen(false));
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'text-emerald-900/80 dark:text-emerald-200/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#061c14]/95 backdrop-blur-xl border-t border-emerald-500/15 dark:border-emerald-800/30 px-4 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
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
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${
                isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-emerald-900/70 dark:text-emerald-300/70 font-semibold'
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
