import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { normalizeNews } from '@/src/lib/normalizers';
import { ContentItem, RawNewsApiArticle } from '@/src/types/content';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase().trim() || searchParams.get('q')?.toLowerCase().trim() || '';
    const category = searchParams.get('category') || 'all';
    const categoriesParam = searchParams.get('categories');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    // Read News API key ONLY on server-side
    const apiKey = process.env.NEWS_API_KEY;

    let newsArticles: ContentItem[] = [];

    // Attempt real external News API fetch if a real key is provided
    if (apiKey && apiKey !== 'mock_demo_news_api_key_server_side_only') {
      try {
        const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
        newsApiUrl.searchParams.append('apiKey', apiKey);
        newsApiUrl.searchParams.append('language', 'en');
        newsApiUrl.searchParams.append('pageSize', pageSize.toString());
        newsApiUrl.searchParams.append('page', page.toString());

        if (query) {
          newsApiUrl.searchParams.append('q', query);
        }

        if (category !== 'all') {
          // News API supported categories: business, entertainment, general, health, science, sports, technology
          const validNewsApiCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
          if (validNewsApiCategories.includes(category.toLowerCase())) {
            newsApiUrl.searchParams.append('category', category.toLowerCase());
          }
        }

        const res = await fetch(newsApiUrl.toString(), {
          headers: {
            'User-Agent': 'PulseStream-Dashboard/1.0',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes server-side
        });

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok' && Array.isArray(data.articles)) {
            newsArticles = data.articles.map((article: RawNewsApiArticle) =>
              normalizeNews({ ...article, category: category !== 'all' ? category : article.category || 'technology' })
            );
          }
        }
      } catch (err) {
        console.warn('News API fetch failed, falling back to normalized fallback news:', err);
      }
    }

    // Fallback or filter mock news dataset if external fetch returned no articles
    if (newsArticles.length === 0) {
      let mockNews = INITIAL_MOCK_FEED.filter((item) => item.type === 'news');

      if (category !== 'all') {
        mockNews = mockNews.filter((item) => item.category === category);
      } else if (categoriesParam) {
        const allowedCats = categoriesParam.split(',');
        if (allowedCats.length > 0) {
          mockNews = mockNews.filter((item) => allowedCats.includes(item.category));
        }
      }

      if (query) {
        mockNews = mockNews.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some((t) => t.toLowerCase().includes(query))
        );
      }

      newsArticles = mockNews;
    }

    const total = newsArticles.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = newsArticles.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      items: paginatedItems,
      total,
      page,
      pageSize,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error in /api/news:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
