import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/src/types/content';
import { loadFromLocalStorage, saveToLocalStorage } from '@/src/lib/utils';

const FEED_ORDER_STORAGE_KEY = 'feed_custom_order_v2';

export interface FeedSliceState {
  items: ContentItem[];
  customOrder: string[];
  currentPage: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loadMoreError: string | null;
  infiniteScroll: boolean;
}

const initialState: FeedSliceState = {
  items: [],
  customOrder: loadFromLocalStorage<string[]>(FEED_ORDER_STORAGE_KEY, []),
  currentPage: 1,
  pageSize: 9,
  total: 0,
  hasMore: true,
  status: 'idle',
  error: null,
  loadMoreError: null,
  infiniteScroll: true,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<ContentItem[] | { items: ContentItem[]; total?: number }>
    ) => {
      const items = Array.isArray(action.payload) ? action.payload : action.payload.items;
      const total = Array.isArray(action.payload) ? items.length : action.payload.total ?? items.length;

      state.items = items;
      state.total = total;
      state.currentPage = 1;
      state.hasMore = items.length < total;
      state.loadMoreError = null;

      if (state.customOrder.length === 0) {
        state.customOrder = items.map((i) => i.id);
        saveToLocalStorage(FEED_ORDER_STORAGE_KEY, state.customOrder);
      }
    },
    appendFeed: (
      state,
      action: PayloadAction<ContentItem[] | { items: ContentItem[]; total?: number; page?: number }>
    ) => {
      const newItems = Array.isArray(action.payload) ? action.payload : action.payload.items;
      const total = Array.isArray(action.payload) ? state.total : action.payload.total ?? state.total;
      const page = Array.isArray(action.payload) ? state.currentPage + 1 : action.payload.page ?? (state.currentPage + 1);

      // Filter out duplicate IDs
      const uniqueNewItems = newItems.filter(
        (newItem) => !state.items.some((item) => item.id === newItem.id)
      );

      state.items.push(...uniqueNewItems);
      state.total = total;
      state.currentPage = page;
      state.hasMore = state.items.length < total;
      state.loadMoreError = null;

      uniqueNewItems.forEach((item) => {
        if (!state.customOrder.includes(item.id)) {
          state.customOrder.push(item.id);
        }
      });

      saveToLocalStorage(FEED_ORDER_STORAGE_KEY, state.customOrder);
    },
    reorderFeed: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.customOrder.indexOf(activeId);
      const newIndex = state.customOrder.indexOf(overId);

      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        const updated = [...state.customOrder];
        const [movedItem] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, movedItem);
        state.customOrder = updated;
        saveToLocalStorage(FEED_ORDER_STORAGE_KEY, updated);
      }
    },
    resetFeed: (state) => {
      state.items = [];
      state.customOrder = [];
      state.currentPage = 1;
      state.total = 0;
      state.hasMore = true;
      state.status = 'idle';
      state.error = null;
      state.loadMoreError = null;
      saveToLocalStorage(FEED_ORDER_STORAGE_KEY, []);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoadMoreError: (state, action: PayloadAction<string | null>) => {
      state.loadMoreError = action.payload;
    },
    toggleInfiniteScroll: (state) => {
      state.infiniteScroll = !state.infiniteScroll;
    },
  },
});

export const {
  setFeed,
  appendFeed,
  reorderFeed,
  resetFeed,
  setCurrentPage,
  setPageSize,
  setStatus,
  setError,
  setLoadMoreError,
  toggleInfiniteScroll,
} = feedSlice.actions;

export default feedSlice.reducer;

