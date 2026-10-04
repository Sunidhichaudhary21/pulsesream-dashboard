import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/src/types/content';
import { loadFromLocalStorage, saveToLocalStorage } from '@/src/lib/utils';

const FAVORITES_STORAGE_KEY = 'user_favorites_v2';
const FAVORITES_IDS_STORAGE_KEY = 'user_favorites_ids_v1';

export interface FavoritesSliceState {
  favorites: ContentItem[];
  favoriteIds: string[];
}

const initialFavorites = loadFromLocalStorage<ContentItem[]>(FAVORITES_STORAGE_KEY, []);
const initialFavoriteIds = loadFromLocalStorage<string[]>(
  FAVORITES_IDS_STORAGE_KEY,
  initialFavorites.map((item) => item.id)
);

const initialState: FavoritesSliceState = {
  favorites: initialFavorites,
  favoriteIds: initialFavoriteIds,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      if (!state.favoriteIds.includes(item.id)) {
        state.favoriteIds.push(item.id);
        state.favorites.push(item);
        saveToLocalStorage(FAVORITES_STORAGE_KEY, state.favorites);
        saveToLocalStorage(FAVORITES_IDS_STORAGE_KEY, state.favoriteIds);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.favoriteIds = state.favoriteIds.filter((item) => item !== id);
      state.favorites = state.favorites.filter((item) => item.id !== id);
      saveToLocalStorage(FAVORITES_STORAGE_KEY, state.favorites);
      saveToLocalStorage(FAVORITES_IDS_STORAGE_KEY, state.favoriteIds);
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem | string>) => {
      const payload = action.payload;
      const id = typeof payload === 'string' ? payload : payload.id;
      const index = state.favoriteIds.indexOf(id);

      if (index >= 0) {
        state.favoriteIds.splice(index, 1);
        state.favorites = state.favorites.filter((item) => item.id !== id);
      } else {
        state.favoriteIds.push(id);
        if (typeof payload === 'object') {
          state.favorites.push(payload);
        }
      }
      saveToLocalStorage(FAVORITES_STORAGE_KEY, state.favorites);
      saveToLocalStorage(FAVORITES_IDS_STORAGE_KEY, state.favoriteIds);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoriteIds = [];
      saveToLocalStorage(FAVORITES_STORAGE_KEY, []);
      saveToLocalStorage(FAVORITES_IDS_STORAGE_KEY, []);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
