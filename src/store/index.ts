import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './slices/preferencesSlice';
import favoritesReducer from './slices/favoritesSlice';
import feedReducer from './slices/feedSlice';
import customOrderReducer from './slices/customOrderSlice';
import uiReducer from './slices/uiSlice';
import { contentApi } from './api/contentApi';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    feed: feedReducer,
    customOrder: customOrderReducer,
    ui: uiReducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(contentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
