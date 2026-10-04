import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  setCategories,
  addCategory,
  removeCategory,
  setContentTypes,
  toggleCategory,
  toggleContentType,
  resetPreferences,
} from '../store/slices/preferencesSlice';
import { UserPreferences } from '../types/content';

const initialTestState: UserPreferences = {
  selectedCategories: ['technology', 'business'],
  contentTypes: ['news', 'social'],
  refreshInterval: 0,
  layoutDensity: 'comfortable',
  autoPlayMedia: true,
};

describe('preferencesSlice', () => {
  it('setCategories updates selected categories list', () => {
    const state = preferencesReducer(initialTestState, setCategories(['gaming', 'design']));
    expect(state.selectedCategories).toEqual(['gaming', 'design']);
  });

  it('addCategory and removeCategory modify categories', () => {
    const state1 = preferencesReducer(initialTestState, addCategory('scifi'));
    expect(state1.selectedCategories).toContain('scifi');

    const state2 = preferencesReducer(state1, removeCategory('scifi'));
    expect(state2.selectedCategories).not.toContain('scifi');
  });

  it('setContentTypes updates allowed content types', () => {
    const state = preferencesReducer(initialTestState, setContentTypes(['movie']));
    expect(state.contentTypes).toEqual(['movie']);
  });

  it('toggles categories correctly', () => {
    const state1 = preferencesReducer(initialTestState, toggleCategory('scifi'));
    expect(state1.selectedCategories).toContain('scifi');

    const state2 = preferencesReducer(state1, toggleCategory('scifi'));
    expect(state2.selectedCategories).not.toContain('scifi');
  });
});
