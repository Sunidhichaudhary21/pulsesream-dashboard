import { ContentItem, RawNewsApiArticle } from '@/src/types/content';
import { normalizeNews } from './normalizers';

interface FetchNewsOptions {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Server-Side News Service Layer.
 * Fetches 100% REAL LIVE news from NewsAPI.org (using process.env.NEWS_API_KEY) 
 * and live public news APIs (SpaceFlight News API).
 * Zero Hardcoded Mock Arrays.
 */
export async function fetchLiveNews(options: FetchNewsOptions = {}): Promise<{
  items: ContentItem[];
  total: number;
  page: number;
}> {
  const { query = '', category = 'all', page = 1, pageSize = 30 } = options;
  const apiKey = process.env.NEWS_API_KEY;

  let newsItems: ContentItem[] = [];

  // Attempt 1: Fetch from NewsAPI.org if API key is present
  if (apiKey && apiKey !== 'mock_demo_news_api_key_server_side_only') {
    try {
      let endpoint = 'https://newsapi.org/v2/top-headlines';
      const url = new URL(endpoint);

      url.searchParams.append('apiKey', apiKey);
      url.searchParams.append('pageSize', pageSize.toString());
      url.searchParams.append('page', page.toString());

      if (query) {
        url.pathname = '/v2/everything';
        url.searchParams.append('q', query);
        url.searchParams.append('sortBy', 'publishedAt');
        url.searchParams.append('language', 'en');
      } else {
        url.searchParams.append('language', 'en');
        const validNewsCategories = [
          'business',
          'entertainment',
          'general',
          'health',
          'science',
          'sports',
          'technology',
        ];
        if (category && category !== 'all' && validNewsCategories.includes(category.toLowerCase())) {
          url.searchParams.append('category', category.toLowerCase());
        }
      }

      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'PulseStream-Dashboard/1.0',
        },
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 300 }, // Cache server-side for 5 minutes
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.articles)) {
          newsItems = data.articles
            .filter(
              (art: RawNewsApiArticle) =>
                art.title &&
                art.title !== '[Removed]' &&
                !art.title.includes('Removed')
            )
            .map((art: RawNewsApiArticle) => {
              return normalizeNews({
                ...art,
                category: category !== 'all' ? category : art.category || 'technology',
              });
            });
        }
      } else {
        console.warn(`NewsAPI returned HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.warn('NewsAPI fetch failed:', err);
    }
  }

  // Attempt 2: Public Live Tech/Science News API if NewsAPI returns no results
  if (newsItems.length === 0) {
    try {
      const publicUrl = new URL('https://api.spaceflightnewsapi.net/v4/articles/');
      publicUrl.searchParams.append('limit', pageSize.toString());
      if (query) {
        publicUrl.searchParams.append('search', query);
      }

      const res = await fetch(publicUrl.toString(), {
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 300 },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          newsItems = data.results.map((art: {
            id: number;
            title: string;
            summary: string;
            url: string;
            image_url: string;
            news_site: string;
            published_at: string;
          }) => {
            const rawArticle: RawNewsApiArticle = {
              title: art.title,
              description: art.summary,
              url: art.url,
              urlToImage: art.image_url,
              publishedAt: art.published_at,
              author: art.news_site,
              category: 'science',
              source: {
                id: art.news_site.toLowerCase().replace(/\s+/g, '-'),
                name: art.news_site,
              },
            };
            return normalizeNews(rawArticle);
          });
        }
      }
    } catch (publicErr) {
      console.warn('Public live news API fallback failed:', publicErr);
    }
  }

  const total = newsItems.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = newsItems.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
  };
}
