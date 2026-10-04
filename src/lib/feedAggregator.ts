import { ContentCategory, ContentItem, ContentType } from '@/src/types/content';
import { fetchTmdbMovies } from './tmdbService';
import { fetchSocialPosts } from './socialService';
import { fetchLiveNews } from './newsService';

export interface AggregateFeedOptions {
  query?: string;
  category?: string;
  type?: string;
  trending?: boolean;
  categories?: string[];
  types?: string[];
  page?: number;
  pageSize?: number;
}

/**
 * Server-Side Feed Aggregator Engine.
 * Combines News, Movie Recommendations, and Social Posts into a unified personalized feed.
 * 100% Live External API Data - Zero Hardcoded Data.
 */
export async function getUnifiedPersonalizedFeed(
  options: AggregateFeedOptions = {}
): Promise<{
  items: ContentItem[];
  total: number;
  page: number;
}> {
  const {
    query = '',
    category = 'all',
    type = 'all',
    trending = false,
    categories = [],
    types = [],
    page = 1,
    pageSize = 20,
  } = options;

  const fetchNewsTask = async (): Promise<ContentItem[]> => {
    const result = await fetchLiveNews({
      query,
      category,
      page: 1,
      pageSize: 50,
    });
    return result.items;
  };

  const fetchMoviesTask = async (): Promise<ContentItem[]> => {
    const result = await fetchTmdbMovies({
      mode: trending ? 'trending' : query ? 'search' : 'popular',
      query,
      category,
      page: 1,
      pageSize: 50,
    });
    return result.items;
  };

  const fetchSocialTask = async (): Promise<ContentItem[]> => {
    const result = await fetchSocialPosts({
      query,
      category,
      page: 1,
      pageSize: 50,
    });
    return result.items;
  };

  // Fault-tolerant parallel fetch using Promise.allSettled
  const results = await Promise.allSettled([
    fetchNewsTask(),
    fetchMoviesTask(),
    fetchSocialTask(),
  ]);

  const rawCombined: ContentItem[] = [];

  results.forEach((res) => {
    if (res.status === 'fulfilled') {
      rawCombined.push(...res.value);
    } else {
      console.warn('One feed source failed during aggregation:', res.reason);
    }
  });

  // 1. Deduplication using Map by ID
  const itemMap = new Map<string, ContentItem>();
  rawCombined.forEach((item) => {
    if (!itemMap.has(item.id)) {
      itemMap.set(item.id, item);
    }
  });

  let unifiedItems = Array.from(itemMap.values());

  // 2. Filter by Content Type
  if (type !== 'all') {
    unifiedItems = unifiedItems.filter((item) => item.type === type);
  } else if (types.length > 0) {
    unifiedItems = unifiedItems.filter((item) => types.includes(item.type));
  }

  // 3. Filter by Category
  if (category !== 'all') {
    unifiedItems = unifiedItems.filter((item) => item.category === category);
  } else if (categories.length > 0) {
    unifiedItems = unifiedItems.filter((item) => categories.includes(item.category));
  }

  // 4. Filter by Trending status
  if (trending) {
    unifiedItems = unifiedItems.filter((item) => item.isTrending);
  }

  // 5. Filter by Search Query across title, description, content, author, tags
  if (query) {
    const q = query.toLowerCase().trim();
    unifiedItems = unifiedItems.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const contentMatch = item.content?.toLowerCase().includes(q);
      const authorMatch = item.author.name.toLowerCase().includes(q);
      const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || contentMatch || authorMatch || tagMatch;
    });
  }

  // 6. Chronological Sorting by publishedAt timestamp descending
  unifiedItems.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA;
  });

  // 7. Pagination
  const total = unifiedItems.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = unifiedItems.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
  };
}
