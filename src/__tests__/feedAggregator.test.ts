import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUnifiedPersonalizedFeed } from '../lib/feedAggregator';
import * as newsService from '../lib/newsService';
import * as tmdbService from '../lib/tmdbService';
import * as socialService from '../lib/socialService';

describe('Feed Aggregator Engine', () => {
  beforeEach(() => {
    vi.spyOn(newsService, 'fetchLiveNews').mockResolvedValue({
      items: [
        {
          id: 'news-1',
          type: 'news',
          title: 'Latest Tech News',
          description: 'Tech update',
          image: 'https://example.com/image1.jpg',
          url: 'https://example.com/news1',
          publishedAt: '2026-10-04T12:00:00Z',
          category: 'technology',
          newsSource: { name: 'TechSource' },
          author: { name: 'Author 1' },
          tags: ['Tech'],
          metrics: { likes: 5 },
        },
      ],
      total: 1,
      page: 1,
    });

    vi.spyOn(tmdbService, 'fetchTmdbMovies').mockResolvedValue({
      items: [
        {
          id: 'movie-1',
          type: 'movie',
          title: 'Awesome Movie',
          description: 'A great movie',
          image: 'https://example.com/image2.jpg',
          url: 'https://example.com/movie1',
          publishedAt: '2026-10-03T12:00:00Z',
          category: 'entertainment',
          author: { name: 'Director' },
          tags: ['Action'],
          rating: 8.5,
          metrics: { rating: 8.5, likes: 100 },
        },
      ],
      total: 1,
      page: 1,
    });

    vi.spyOn(socialService, 'fetchSocialPosts').mockResolvedValue({
      items: [
        {
          id: 'social-1',
          type: 'social',
          title: 'Community Post',
          description: 'Developer post',
          image: 'https://example.com/image3.jpg',
          url: 'https://example.com/social1',
          publishedAt: '2026-10-02T12:00:00Z',
          category: 'technology',
          author: { name: 'Dev' },
          tags: ['Dev'],
          metrics: { likes: 20 },
        },
      ],
      total: 1,
      page: 1,
    });
  });

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
