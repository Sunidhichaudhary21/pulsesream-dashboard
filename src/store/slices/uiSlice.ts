import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentCategory, ContentType, FeedTab, SidebarNavTab, ThemeMode } from '@/src/types/content';
import { loadFromLocalStorage, saveToLocalStorage } from '@/src/lib/utils';

const THEME_STORAGE_KEY = 'app_theme_v1';
const LAYOUT_MODE_STORAGE_KEY = 'app_layout_mode_v1';

interface UiState {
  theme: ThemeMode;
  sidebarTab: SidebarNavTab;
  activeTab: FeedTab;
  searchQuery: string;
  categoryFilter: ContentCategory | 'all';
  typeFilter: ContentType | 'all';
  selectedTag: string | null;
  layoutMode: 'grid' | 'list';
  isPreferencesModalOpen: boolean;
  isAddPostModalOpen: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationsOpen: boolean;
}

const initialState: UiState = {
  theme: loadFromLocalStorage<ThemeMode>(THEME_STORAGE_KEY, 'light'),
  sidebarTab: 'dashboard',
  activeTab: 'all',
  searchQuery: '',
  categoryFilter: 'all',
  typeFilter: 'all',
  selectedTag: null,
  layoutMode: loadFromLocalStorage<'grid' | 'list'>(LAYOUT_MODE_STORAGE_KEY, 'grid'),
  isPreferencesModalOpen: false,
  isAddPostModalOpen: false,
  isMobileSidebarOpen: false,
  isNotificationsOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      saveToLocalStorage(THEME_STORAGE_KEY, action.payload);
    },
    setSidebarTab: (state, action: PayloadAction<SidebarNavTab>) => {
      state.sidebarTab = action.payload;
      if (action.payload === 'trending') {
        state.activeTab = 'trending';
      } else if (action.payload === 'favorites') {
        state.activeTab = 'favorites';
      } else if (action.payload === 'dashboard') {
        state.activeTab = 'all';
      }
    },
    setSelectedSection: (state, action: PayloadAction<SidebarNavTab>) => {
      state.sidebarTab = action.payload;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<FeedTab>) => {
      state.activeTab = action.payload;
      if (action.payload === 'trending') {
        state.sidebarTab = 'trending';
      } else if (action.payload === 'favorites') {
        state.sidebarTab = 'favorites';
      } else if (action.payload === 'all') {
        state.sidebarTab = 'dashboard';
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<ContentCategory | 'all'>) => {
      state.categoryFilter = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.typeFilter = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
      if (action.payload) {
        state.searchQuery = action.payload;
      }
    },
    setLayoutMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layoutMode = action.payload;
      saveToLocalStorage(LAYOUT_MODE_STORAGE_KEY, action.payload);
    },
    setPreferencesModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isPreferencesModalOpen = action.payload;
    },
    setAddPostModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddPostModalOpen = action.payload;
    },
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.isNotificationsOpen = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.categoryFilter = 'all';
      state.typeFilter = 'all';
      state.selectedTag = null;
    },
  },
});

export const {
  setTheme,
  setSidebarTab,
  setSelectedSection,
  setMobileSidebarOpen,
  setSidebarState,
  setActiveTab,
  setSearchQuery,
  setCategoryFilter,
  setTypeFilter,
  setSelectedTag,
  setLayoutMode,
  setPreferencesModalOpen,
  setAddPostModalOpen,
  setNotificationsOpen,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
