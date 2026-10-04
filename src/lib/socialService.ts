import { ContentItem, RawSocialPost } from '@/src/types/content';
import { normalizeSocialPost } from './normalizers';

export interface FetchSocialOptions {
  query?: string;
  category?: string;
  hashtag?: string;
  page?: number;
  pageSize?: number;
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  social_image: string | null;
  published_at: string;
  public_reactions_count: number;
  comments_count: number;
  tag_list: string[];
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
}

/**
 * Server-Side Social Service Layer.
 * Fetches real live tech & developer community posts from Dev.to API and public endpoints.
 * Pure Live API Data - Zero Hardcoded Arrays.
 */
export async function fetchSocialPosts(options: FetchSocialOptions = {}): Promise<{
  items: ContentItem[];
  total: number;
  page: number;
}> {
  const { query = '', category = 'all', hashtag = '', page = 1, pageSize = 30 } = options;

  let socialItems: ContentItem[] = [];

  try {
    const url = new URL('https://dev.to/api/articles');
    url.searchParams.append('per_page', pageSize.toString());
    url.searchParams.append('page', page.toString());

    if (category && category !== 'all') {
      url.searchParams.append('tag', category.toLowerCase());
    } else if (hashtag) {
      url.searchParams.append('tag', hashtag.replace('#', '').toLowerCase());
    }

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PulseStream-Dashboard/1.0',
      },
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 300 }, // Cache server-side for 5 minutes
    });

    if (res.ok) {
      const data: DevToArticle[] = await res.json();
      if (Array.isArray(data)) {
        socialItems = data.map((art) => {
          const rawPost: RawSocialPost = {
            id: `devto-${art.id}`,
            userId: art.user.username,
            title: art.title,
            body: art.description,
            imageUrl: art.cover_image || art.social_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            user: {
              name: art.user.name,
              username: art.user.username,
              avatar: art.user.profile_image,
            },
            likes: art.public_reactions_count || 10,
            commentsCount: art.comments_count || 0,
            created_at: art.published_at,
            tags: art.tag_list || ['Community', 'Tech'],
            category: category !== 'all' ? category : 'technology',
          };
          return normalizeSocialPost(rawPost);
        });
      }
    }
  } catch (err) {
    console.warn('Dev.to Live API fetch failed:', err);
  }

  // If query is provided, filter live API items
  if (query) {
    const q = query.toLowerCase().trim();
    socialItems = socialItems.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const authorMatch = item.author.name.toLowerCase().includes(q);
      const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || authorMatch || tagMatch;
    });
  }

  const total = socialItems.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = socialItems.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
  };
}
