import { describe, it, expect } from 'vitest';
import feedReducer, {
  setFeed,
  appendFeed,
  reorderFeed,
  resetFeed,
  setCurrentPage,
  toggleInfiniteScroll,
} from '../store/slices/feedSlice';
import { ContentItem } from '../types/content';

const item1: ContentItem = {
  id: 'item-1',
  type: 'news',
  title: 'Item 1',
  description: 'Desc 1',
  image: 'img.jpg',
  category: 'technology',
  author: { name: 'Author' },
  publishedAt: new Date().toISOString(),
  tags: [],
  metrics: {},
};

const item2: ContentItem = {
  id: 'item-2',
  type: 'movie',
  title: 'Item 2',
  description: 'Desc 2',
  image: 'img2.jpg',
  category: 'movies',
  author: { name: 'Author 2' },
  publishedAt: new Date().toISOString(),
  tags: [],
  metrics: {},
};

const item3: ContentItem = {
  id: 'item-3',
  type: 'social',
  title: 'Item 3',
  description: 'Desc 3',
  image: 'img3.jpg',
  category: 'technology',
  author: { name: 'Author 3' },
  publishedAt: new Date().toISOString(),
  tags: [],
  metrics: {},
};

describe('feedSlice', () => {
  const baseState = {
    items: [],
    customOrder: [],
    currentPage: 1,
    pageSize: 9,
    total: 0,
    hasMore: true,
    status: 'idle' as const,
    error: null,
    loadMoreError: null,
    infiniteScroll: true,
  };

  it('sets feed items, total count, and custom order', () => {
    const state = feedReducer(
      baseState,
      setFeed({ items: [item1, item2], total: 10 })
    );
    expect(state.items).toHaveLength(2);
    expect(state.total).toBe(10);
    expect(state.hasMore).toBe(true);
    expect(state.customOrder).toEqual(['item-1', 'item-2']);
  });

  it('appends unique feed items and updates page count without duplicates', () => {
    const initialState = {
      ...baseState,
      items: [item1],
      customOrder: ['item-1'],
      total: 10,
    };

    // Try appending item1 (duplicate) and item3 (new)
    const state = feedReducer(
      initialState,
      appendFeed({ items: [item1, item3], total: 10, page: 2 })
    );

    expect(state.items).toHaveLength(2);
    expect(state.items.map((i) => i.id)).toEqual(['item-1', 'item-3']);
    expect(state.currentPage).toBe(2);
  });

  it('reorders feed items via reorderFeed action', () => {
    const initialState = {
      ...baseState,
      items: [item1, item2],
      customOrder: ['item-1', 'item-2'],
    };

    const state = feedReducer(initialState, reorderFeed({ activeId: 'item-1', overId: 'item-2' }));
    expect(state.customOrder).toEqual(['item-2', 'item-1']);
  });

  it('toggles infinite scroll mode', () => {
    const state = feedReducer(baseState, toggleInfiniteScroll());
    expect(state.infiniteScroll).toBe(false);
  });

  it('resets feed state', () => {
    const initialState = {
      ...baseState,
      items: [item1, item2],
      customOrder: ['item-1', 'item-2'],
      currentPage: 3,
      total: 20,
    };

    const state = feedReducer(initialState, resetFeed());
    expect(state.items).toHaveLength(0);
    expect(state.customOrder).toHaveLength(0);
    expect(state.currentPage).toBe(1);
    expect(state.total).toBe(0);
  });
});

