import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  clearFavorites,
} from '../store/slices/favoritesSlice';
import { ContentItem } from '../types/content';

const mockItem: ContentItem = {
  id: 'item-100',
  type: 'news',
  title: 'Test Article',
  description: 'Test Description',
  image: 'https://example.com/img.jpg',
  category: 'technology',
  author: { name: 'Author' },
  publishedAt: new Date().toISOString(),
  tags: ['Test'],
  metrics: {},
};

describe('favoritesSlice', () => {
  it('adds and removes favorite items correctly', () => {
    const state1 = favoritesReducer({ favorites: [], favoriteIds: [] }, addFavorite(mockItem));
    expect(state1.favoriteIds).toContain('item-100');
    expect(state1.favorites).toHaveLength(1);

    const state2 = favoritesReducer(state1, removeFavorite('item-100'));
    expect(state2.favoriteIds).not.toContain('item-100');
    expect(state2.favorites).toHaveLength(0);
  });

  it('toggles favorites correctly', () => {
    const state1 = favoritesReducer({ favorites: [], favoriteIds: [] }, toggleFavorite(mockItem));
    expect(state1.favoriteIds).toContain('item-100');

    const state2 = favoritesReducer(state1, toggleFavorite(mockItem.id));
    expect(state2.favoriteIds).not.toContain('item-100');
  });

  it('clears all favorites', () => {
    const state1 = favoritesReducer({ favorites: [mockItem], favoriteIds: ['item-100'] }, clearFavorites());
    expect(state1.favoriteIds).toHaveLength(0);
    expect(state1.favorites).toHaveLength(0);
  });
});
