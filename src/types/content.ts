export type ContentType = 'news' | 'movie' | 'social';

export type ContentCategory =
  | 'technology'
  | 'business'
  | 'finance'
  | 'sports'
  | 'science'
  | 'entertainment'
  | 'health'
  | 'movies'
  | 'scifi'
  | 'action'
  | 'gaming'
  | 'design'
  | 'general';

export interface Author {
  name: string;
  avatar?: string;
  role?: string;
  handle?: string;
}

export interface ContentMetrics {
  likes?: number;
  shares?: number;
  commentsCount?: number;
  rating?: number; // e.g. 8.5/10 for movies
  views?: number;
}

export interface MovieDetails {
  director?: string;
  year?: number;
  rating?: number;
  duration?: string;
  genres?: string[];
  cast?: string[];
}

export interface NewsSource {
  name: string;
  url?: string;
  logo?: string;
}

// Common Unified Content Model
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string;
  imageUrl?: string; // Backward compatibility alias
  category: ContentCategory;
  url?: string;
  author: Author;
  publishedAt: string; // ISO format string
  rating?: number;
  isFavorite?: boolean;
  isTrending?: boolean;
  content?: string;
  tags: string[];
  metrics: ContentMetrics;
  movieDetails?: MovieDetails;
  newsSource?: NewsSource;
}

// Backward compatibility alias for ContentItem
export type FeedItem = ContentItem;

// Specialized Content Types
export interface NewsItem extends ContentItem {
  type: 'news';
  newsSource?: NewsSource;
}

export interface MovieItem extends ContentItem {
  type: 'movie';
  rating: number;
  movieDetails: MovieDetails;
}

export interface SocialPost extends ContentItem {
  type: 'social';
}

// Application State Models
export interface UserPreferences {
  selectedCategories: ContentCategory[];
  contentTypes: ContentType[];
  refreshInterval: number; // seconds (0 = disabled)
  layoutDensity: 'comfortable' | 'compact';
  autoPlayMedia: boolean;
}

export type SidebarNavTab = 'dashboard' | 'trending' | 'favorites' | 'settings';

export type FeedTab = 'all' | 'news' | 'movie' | 'social' | 'trending' | 'favorites';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface FeedState {
  items: ContentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  total: number;
  lastUpdated: string | null;
}

export interface FavoritesState {
  favoriteIds: string[];
}

export interface UIState {
  theme: ThemeMode;
  sidebarTab: SidebarNavTab;
  activeTab: FeedTab;
  searchQuery: string;
  categoryFilter: ContentCategory | 'all';
  typeFilter: ContentType | 'all';
  selectedTag: string | null;
  layoutMode: 'grid' | 'list';
  isPreferencesModalOpen: boolean;
  isAddPostModalOpen: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationsOpen: boolean;
}

export interface SearchState {
  query: string;
  debouncedQuery: string;
  category: ContentCategory | 'all';
  contentType: ContentType | 'all';
  sortBy: 'latest' | 'popular' | 'trending';
  onlyFavorites: boolean;
}

export interface FeedResponse {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
}

// Raw External API Schema Types for Normalization
export interface RawNewsApiArticle {
  source?: { id?: string | null; name?: string };
  author?: string | null;
  title?: string;
  description?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
  content?: string | null;
  category?: string;
}

export interface RawTmdbMovie {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  director?: string;
  runtime?: number;
}

export interface RawSocialPost {
  id: number | string;
  userId?: number | string;
  title: string;
  body?: string;
  imageUrl?: string;
  user?: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  likes?: number;
  commentsCount?: number;
  created_at?: string;
  tags?: string[];
  category?: string;
}
