import React from 'react';
import { Sidebar } from '@/src/components/dashboard/Sidebar';
import { Header } from '@/src/components/dashboard/Header';
import { MobileNav } from '@/src/components/dashboard/MobileNav';
import { WelcomeSection } from '@/src/components/dashboard/WelcomeSection';
import { InterestChips } from '@/src/components/dashboard/InterestChips';
import { TrendingSection } from '@/src/components/dashboard/TrendingSection';
import { RecommendedSection } from '@/src/components/dashboard/RecommendedSection';
import { SocialPulseSection } from '@/src/components/dashboard/SocialPulseSection';
import { SearchFilterBar } from '@/src/components/feed/SearchFilterBar';
import { FeedContainer } from '@/src/components/feed/FeedContainer';
import { PreferencesModal } from '@/src/components/feed/PreferencesModal';
import { AddPostModal } from '@/src/components/feed/AddPostModal';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-white text-emerald-950 overflow-hidden font-sans transition-colors duration-300">
      {/* 1. Desktop Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto scrollbar-thin bg-white">
        {/* 2. Top Header */}
        <Header />

        {/* 3. Main Dashboard Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 space-y-6">
          {/* Welcome Section */}
          <WelcomeSection />

          {/* Interest Chips Bar */}
          <InterestChips />

          {/* Personalized Unified Feed */}
          <div className="my-8">
            <SearchFilterBar />
            <FeedContainer />
          </div>

          {/* Trending Section */}
          <TrendingSection />

          {/* Recommended Section */}
          <RecommendedSection />

          {/* Social Pulse Section */}
          <SocialPulseSection />
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-emerald-100 bg-emerald-50/40 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-800">
            <p>© {new Date().getFullYear()} PulseStream Dashboard Studio. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Green & White Theme Active
              </span>
              <span>•</span>
              <span>Next.js 16 App Router</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 4. Mobile Responsive Navigation */}
      <MobileNav />

      {/* Modals */}
      <PreferencesModal />
      <AddPostModal />
    </div>
  );
}
