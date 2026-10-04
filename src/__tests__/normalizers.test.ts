import { describe, it, expect } from 'vitest';
import {
  normalizeNews,
  normalizeMovie,
  normalizeSocialPost,
  normalizeContentItem,
} from '../lib/normalizers';

describe('Normalizer Functions', () => {
  it('normalizeNews converts RawNewsApiArticle into unified ContentItem format', () => {
    const rawNews = {
      title: 'Breaking Tech News',
      description: 'Quantum tech update',
      url: 'https://example.com/news-1',
      urlToImage: 'https://example.com/image.jpg',
      author: 'Jane Doe',
      publishedAt: '2026-10-03T10:00:00Z',
      category: 'technology',
    };

    const item = normalizeNews(rawNews);

    expect(item.id).toBe(`news-${encodeURIComponent('https://example.com/news-1')}`);
    expect(item.type).toBe('news');
    expect(item.title).toBe('Breaking Tech News');
    expect(item.image).toBe('https://example.com/image.jpg');
    expect(item.category).toBe('technology');
    expect(item.author.name).toBe('Jane Doe');
  });

  it('normalizeMovie converts RawTmdbMovie into unified ContentItem format', () => {
    const rawMovie = {
      id: 99,
      title: 'Interstellar Odyssey',
      overview: 'Space journey beyond stars.',
      poster_path: '/poster.jpg',
      release_date: '2026-05-15',
      vote_average: 9.1,
    };

    const item = normalizeMovie(rawMovie);

    expect(item.id).toBe('movie-99');
    expect(item.type).toBe('movie');
    expect(item.rating).toBe(9.1);
    expect(item.image).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('normalizeSocialPost converts RawSocialPost into unified ContentItem format', () => {
    const rawPost = {
      id: 'post-101',
      title: 'Next.js 16 Tips',
      body: 'Here is how to optimize server components.',
      user: { name: 'Alex', username: 'alex_dev' },
      likes: 450,
      commentsCount: 32,
    };

    const item = normalizeSocialPost(rawPost);

    expect(item.id).toBe('social-post-101');
    expect(item.type).toBe('social');
    expect(item.author.name).toBe('Alex');
    expect(item.author.handle).toBe('@alex_dev');
    expect(item.metrics.likes).toBe(450);
  });

  it('normalizeContentItem handles unknown objects polymorphically', () => {
    const rawMovieObj = {
      type: 'movie',
      id: 55,
      title: 'Sci-Fi Film',
      overview: 'A cool space film.',
      vote_average: 8.5,
    };

    const item = normalizeContentItem(rawMovieObj);

    expect(item.type).toBe('movie');
    expect(item.title).toBe('Sci-Fi Film');
  });
});
