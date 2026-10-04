'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  setTheme,
  setSearchQuery,
  setMobileSidebarOpen,
  setNotificationsOpen,
  setAddPostModalOpen,
  setPreferencesModalOpen,
} from '@/src/store/slices/uiSlice';
import { useDebounce } from '@/src/hooks/useDebounce';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  Command,
} from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, searchQuery, isNotificationsOpen } = useAppSelector((state) => state.ui);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMounted, setIsMounted] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('dashboard-header-search');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    { id: '1', title: 'New Quantum Computing article published', time: '10m ago', unread: true },
    { id: '2', title: 'Your saved post reached 1k likes', time: '1h ago', unread: true },
    { id: '3', title: 'Weekly personalization digest ready', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const isDarkMode = isMounted
    ? theme === 'dark' ||
      (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-emerald-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile Hamburger & Brand Title */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setMobileSidebarOpen(true))}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-emerald-900" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-emerald-950">PulseStream</span>
          </div>
        </div>

        {/* Search Bar (Desktop, Tablet & Mobile) */}
        <div className="flex-1 max-w-md relative min-w-0 mx-1 sm:mx-0">
          <Input
            id="dashboard-header-search"
            placeholder="Search feed, news, movies..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-emerald-600" />}
            className="text-xs sm:text-sm py-2 sm:py-2.5"
            rightElement={
              localSearch ? (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    dispatch(setSearchQuery(''));
                  }}
                  className="p-1 text-emerald-600 hover:text-emerald-900"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md select-none">
                  <Command className="w-3 h-3" /> K
                </kbd>
              )
            }
          />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Create Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => dispatch(setAddPostModalOpen(true))}
            className="hidden sm:flex items-center gap-1.5 font-bold shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Post</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setTheme(isDarkMode ? 'light' : 'dark'))}
            aria-label="Toggle Dark/Light Mode"
            className="rounded-xl"
            title={isMounted ? (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Toggle Theme'}
            suppressHydrationWarning
          >
            {isMounted && isDarkMode ? (
              <Sun className="w-5 h-5 text-emerald-600 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-800 hover:-rotate-12 transition-transform" />
            )}
          </Button>

          {/* Notification Icon & Dropdown Popover */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(setNotificationsOpen(!isNotificationsOpen))}
              aria-label="View notifications"
              className="relative rounded-xl text-emerald-900"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              )}
            </Button>

            {/* Notification Popover Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-emerald-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-950">Notifications</h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    {unreadCount} Unread
                  </span>
                </div>
                <div className="divide-y divide-emerald-100 max-h-60 overflow-y-auto my-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 flex items-start gap-2.5 hover:bg-emerald-50 px-2 rounded-xl transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-emerald-200'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-emerald-950 leading-snug">{n.title}</p>
                        <span className="text-[10px] font-medium text-emerald-700">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => dispatch(setNotificationsOpen(false))}
                  className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-950 pt-2"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* User Profile Area */}
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-200">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Rivera"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-300 shadow-sm"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-extrabold text-emerald-950 leading-tight">Alex Rivera</p>
              <p className="text-[10px] font-bold text-emerald-600">Pro Curator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
