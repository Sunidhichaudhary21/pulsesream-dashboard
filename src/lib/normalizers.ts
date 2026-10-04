import {
  ContentItem,
  NewsItem,
  MovieItem,
  SocialPost,
  RawNewsApiArticle,
  RawTmdbMovie,
  RawSocialPost,
  ContentCategory,
} from '@/src/types/content';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

export function parseCategory(categoryStr?: string | null): ContentCategory {
  if (!categoryStr) return 'general';
  const lower = categoryStr.toLowerCase().trim();
  const validCategories: ContentCategory[] = [
    'technology',
    'business',
    'entertainment',
    'movies',
    'scifi',
    'action',
    'gaming',
    'science',
    'design',
    'general',
  ];
  return validCategories.includes(lower as ContentCategory)
    ? (lower as ContentCategory)
    : 'general';
}

/**
 * Normalizes raw News API articles into a clean unified NewsItem format.
 */
export function normalizeNews(raw: RawNewsApiArticle): NewsItem {
  const imageUrl = raw.urlToImage || DEFAULT_IMAGE;
  return {
    id: `news-${raw.url ? encodeURIComponent(raw.url) : Math.random().toString(36).substring(2, 9)}`,
    type: 'news',
    title: raw.title || 'Untitled News Article',
    description: raw.description || 'No summary available for this news item.',
    image: imageUrl,
    imageUrl,
    category: parseCategory(raw.category || 'technology'),
    url: raw.url || '#',
    author: {
      name: raw.author || raw.source?.name || 'News Desk Editor',
      role: 'Journalist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: raw.publishedAt || new Date().toISOString(),
    rating: undefined,
    isFavorite: false,
    isTrending: false,
    content: raw.content || undefined,
    tags: ['News', parseCategory(raw.category)],
    metrics: {
      views: Math.floor(Math.random() * 20000) + 1000,
      likes: Math.floor(Math.random() * 1500) + 50,
      shares: Math.floor(Math.random() * 300) + 10,
    },
    newsSource: {
      name: raw.source?.name || 'Global News Network',
      url: raw.url,
    },
  };
}

/**
 * Normalizes raw TMDB Movie API responses into a clean unified MovieItem format.
 */
export function normalizeMovie(raw: RawTmdbMovie): MovieItem {
  const posterBase = 'https://image.tmdb.org/t/p/w500';
  const imageUrl = raw.poster_path
    ? `${posterBase}${raw.poster_path}`
    : raw.backdrop_path
    ? `${posterBase}${raw.backdrop_path}`
    : DEFAULT_IMAGE;

  const year = raw.release_date ? new Date(raw.release_date).getFullYear() : 2026;
  const rating = raw.vote_average ? Number(raw.vote_average.toFixed(1)) : 8.0;

  return {
    id: `movie-${raw.id}`,
    type: 'movie',
    title: raw.title || 'Untitled Cinema Release',
    description: raw.overview || 'No synopsis available for this film.',
    image: imageUrl,
    imageUrl,
    category: 'movies',
    url: raw.id ? `https://www.themoviedb.org/movie/${raw.id}` : 'https://www.themoviedb.org',
    author: {
      name: raw.director || 'Cinephile Critic',
      role: 'Film Curator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: raw.release_date || new Date().toISOString(),
    rating,
    isFavorite: false,
    isTrending: rating >= 8.5,
    tags: ['Cinema', 'Film', 'Movies'],
    metrics: {
      rating,
      likes: (raw.vote_count || 100) * 10,
      views: (raw.vote_count || 100) * 85,
    },
    movieDetails: {
      director: raw.director || 'Visionary Director',
      year,
      rating,
      duration: raw.runtime ? `${Math.floor(raw.runtime / 60)}h ${raw.runtime % 60}m` : '2h 15m',
      genres: ['Drama', 'Sci-Fi'],
    },
  };
}

/**
 * Normalizes raw social post responses (e.g. JSONPlaceholder / Community API) into SocialPost.
 */
export function normalizeSocialPost(raw: RawSocialPost): SocialPost {
  const imageUrl = raw.imageUrl || DEFAULT_IMAGE;
  return {
    id: `social-${raw.id}`,
    type: 'social',
    title: raw.title || 'Community Update',
    description: raw.body || 'No text content in this post.',
    image: imageUrl,
    imageUrl,
    category: parseCategory(raw.category || 'design'),
    url: '#',
    author: {
      name: raw.user?.name || 'Community Member',
      handle: raw.user?.username ? `@${raw.user.username}` : '@user',
      avatar: raw.user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Community Creator',
    },
    publishedAt: raw.created_at || new Date().toISOString(),
    rating: undefined,
    isFavorite: false,
    isTrending: (raw.likes || 0) > 1000,
    tags: raw.tags && raw.tags.length > 0 ? raw.tags : ['Community', 'Discussion'],
    metrics: {
      likes: raw.likes || 150,
      commentsCount: raw.commentsCount || 18,
    },
  };
}

/**
 * Type-safe polymorphic normalizer that checks object structure and transforms unknown objects into ContentItem.
 */
export function normalizeContentItem(raw: unknown): ContentItem {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid raw item: expected an object');
  }

  const obj = raw as Record<string, unknown>;

  if (obj.type === 'news' || 'urlToImage' in obj) {
    return normalizeNews(obj as unknown as RawNewsApiArticle);
  }

  if (obj.type === 'movie' || 'vote_average' in obj || 'poster_path' in obj) {
    return normalizeMovie(obj as unknown as RawTmdbMovie);
  }

  if (obj.type === 'social' || 'userId' in obj || 'body' in obj) {
    return normalizeSocialPost(obj as unknown as RawSocialPost);
  }

  // Fallback for valid ContentItem or partial FeedItem objects
  const id = typeof obj.id === 'string' || typeof obj.id === 'number' ? String(obj.id) : `item-${Date.now()}`;
  const title = typeof obj.title === 'string' ? obj.title : 'Untitled Content';
  const description = typeof obj.description === 'string' ? obj.description : '';
  const image = typeof obj.image === 'string' ? obj.image : typeof obj.imageUrl === 'string' ? obj.imageUrl : DEFAULT_IMAGE;
  const category = parseCategory(typeof obj.category === 'string' ? obj.category : 'general');
  const type = obj.type === 'news' || obj.type === 'movie' || obj.type === 'social' ? obj.type : 'news';

  return {
    id,
    type,
    title,
    description,
    image,
    imageUrl: image,
    category,
    url: typeof obj.url === 'string' ? obj.url : '#',
    author: {
      name: typeof obj.author === 'object' && obj.author !== null && 'name' in obj.author && typeof (obj.author as Record<string, unknown>).name === 'string'
        ? ((obj.author as Record<string, unknown>).name as string)
        : 'PulseStream Curator',
    },
    publishedAt: typeof obj.publishedAt === 'string' ? obj.publishedAt : new Date().toISOString(),
    rating: typeof obj.rating === 'number' ? obj.rating : undefined,
    isFavorite: Boolean(obj.isFavorite),
    isTrending: Boolean(obj.isTrending),
    tags: Array.isArray(obj.tags) ? obj.tags.filter((t): t is string => typeof t === 'string') : [],
    metrics: typeof obj.metrics === 'object' && obj.metrics !== null ? (obj.metrics as ContentItem['metrics']) : {},
  };
}
