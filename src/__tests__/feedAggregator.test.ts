import { describe, it, expect } from 'vitest';
import { getUnifiedPersonalizedFeed } from '../lib/feedAggregator';

describe('Feed Aggregator Engine', () => {
  it('combines news, movies, and social posts into unified feed', async () => {
    const result = await getUnifiedPersonalizedFeed({
      category: 'all',
      type: 'all',
    });

    expect(result.items.length).toBeGreaterThan(0);
    const types = new Set(result.items.map((i) => i.type));
    expect(types.has('news') || types.has('movie') || types.has('social')).toBe(true);
  });

  it('removes duplicate items based on stable IDs', async () => {
    const result = await getUnifiedPersonalizedFeed({ category: 'all' });
    const ids = result.items.map((i) => i.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('filters by content type cleanly', async () => {
    const movieResult = await getUnifiedPersonalizedFeed({ type: 'movie' });
    movieResult.items.forEach((item) => {
      expect(item.type).toBe('movie');
    });
  });

  it('sorts items chronologically by publishedAt timestamp descending', async () => {
    const result = await getUnifiedPersonalizedFeed({ category: 'all' });
    if (result.items.length >= 2) {
      const time1 = new Date(result.items[0].publishedAt).getTime();
      const time2 = new Date(result.items[1].publishedAt).getTime();
      expect(time1).toBeGreaterThanOrEqual(time2);
    }
  });
});
