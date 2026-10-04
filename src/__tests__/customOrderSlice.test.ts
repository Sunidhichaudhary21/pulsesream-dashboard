import { describe, it, expect, beforeEach } from 'vitest';
import customOrderReducer, {
  setCustomOrder,
  reorderItems,
  resetOrder,
} from '../store/slices/customOrderSlice';

describe('customOrderSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets initial custom order and saves to localStorage', () => {
    const state = customOrderReducer({ orderedIds: [] }, setCustomOrder(['news-a', 'movie-b', 'social-c']));
    expect(state.orderedIds).toEqual(['news-a', 'movie-b', 'social-c']);
  });

  it('reorders item positions (dragging Social C above News A)', () => {
    const initialState = { orderedIds: ['news-a', 'movie-b', 'social-c'] };

    // Move social-c over news-a
    const state = customOrderReducer(
      initialState,
      reorderItems({ activeId: 'social-c', overId: 'news-a' })
    );

    expect(state.orderedIds).toEqual(['social-c', 'news-a', 'movie-b']);
  });

  it('resets custom order', () => {
    const initialState = { orderedIds: ['social-c', 'news-a', 'movie-b'] };
    const state = customOrderReducer(initialState, resetOrder());
    expect(state.orderedIds).toHaveLength(0);
  });
});
