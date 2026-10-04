import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentCategory, ContentType, UserPreferences } from '@/src/types/content';
import { loadFromLocalStorage, saveToLocalStorage } from '@/src/lib/utils';

const PREFERENCES_STORAGE_KEY = 'user_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedCategories: [
    'technology',
    'business',
    'entertainment',
    'movies',
    'scifi',
    'action',
    'gaming',
    'science',
    'design',
  ],
  contentTypes: ['news', 'movie', 'social'],
  refreshInterval: 0, // 0 = disabled
  layoutDensity: 'comfortable',
  autoPlayMedia: true,
};

const initialState: UserPreferences = loadFromLocalStorage(PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES);

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ContentCategory[]>) => {
      state.selectedCategories = action.payload;
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
    },
    addCategory: (state, action: PayloadAction<ContentCategory>) => {
      if (!state.selectedCategories.includes(action.payload)) {
        state.selectedCategories.push(action.payload);
        saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
      }
    },
    removeCategory: (state, action: PayloadAction<ContentCategory>) => {
      if (state.selectedCategories.length > 1) {
        state.selectedCategories = state.selectedCategories.filter((c) => c !== action.payload);
        saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
      }
    },
    setContentTypes: (state, action: PayloadAction<ContentType[]>) => {
      state.contentTypes = action.payload;
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
    },
    toggleCategory: (state, action: PayloadAction<ContentCategory>) => {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        if (state.selectedCategories.length > 1) {
          state.selectedCategories = state.selectedCategories.filter((c) => c !== category);
        }
      } else {
        state.selectedCategories.push(category);
      }
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
    },
    toggleContentType: (state, action: PayloadAction<ContentType>) => {
      const type = action.payload;
      if (state.contentTypes.includes(type)) {
        if (state.contentTypes.length > 1) {
          state.contentTypes = state.contentTypes.filter((t) => t !== type);
        }
      } else {
        state.contentTypes.push(type);
      }
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      Object.assign(state, action.payload);
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, state);
    },
    resetPreferences: (state) => {
      Object.assign(state, DEFAULT_PREFERENCES);
      saveToLocalStorage(PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES);
    },
  },
});

export const {
  setCategories,
  addCategory,
  removeCategory,
  setContentTypes,
  toggleCategory,
  toggleContentType,
  updatePreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
