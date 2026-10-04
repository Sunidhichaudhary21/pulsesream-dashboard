import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContentItem, FeedResponse } from '@/src/types/content';

interface FetchFeedParams {
  query?: string;
  category?: string;
  type?: string;
  trending?: boolean;
  categories?: string[];
  types?: string[];
  page?: number;
  pageSize?: number;
}

interface FetchNewsParams {
  query?: string;
  category?: string;
  categories?: string[];
  page?: number;
  pageSize?: number;
}

interface FetchMovieParams {
  query?: string;
  category?: string;
  mode?: 'popular' | 'trending' | 'search';
  trending?: boolean;
  page?: number;
  pageSize?: number;
}

interface FetchSocialParams {
  query?: string;
  category?: string;
  hashtag?: string;
  page?: number;
  pageSize?: number;
}

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Feed', 'News', 'Movie', 'Social'],
  endpoints: (builder) => ({
    getFeed: builder.query<FeedResponse, FetchFeedParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.query) queryParams.append('query', params.query);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.type && params.type !== 'all') queryParams.append('type', params.type);
        if (params.trending) queryParams.append('trending', 'true');
        if (params.categories && params.categories.length > 0) {
          queryParams.append('categories', params.categories.join(','));
        }
        if (params.types && params.types.length > 0) {
          queryParams.append('types', params.types.join(','));
        }
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        return `/feed?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Feed' as const, id })),
              { type: 'Feed', id: 'LIST' },
            ]
          : [{ type: 'Feed', id: 'LIST' }],
    }),
    getNews: builder.query<FeedResponse, FetchNewsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.query) queryParams.append('query', params.query);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.categories && params.categories.length > 0) {
          queryParams.append('categories', params.categories.join(','));
        }
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        return `/news?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'News' as const, id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),
    getMovies: builder.query<FeedResponse, FetchMovieParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.query) queryParams.append('query', params.query);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.mode) queryParams.append('mode', params.mode);
        if (params.trending) queryParams.append('trending', 'true');
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        return `/movies?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Movie' as const, id })),
              { type: 'Movie', id: 'LIST' },
            ]
          : [{ type: 'Movie', id: 'LIST' }],
    }),
    getSocialPosts: builder.query<FeedResponse, FetchSocialParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.query) queryParams.append('query', params.query);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.hashtag) queryParams.append('hashtag', params.hashtag);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        return `/social?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Social' as const, id })),
              { type: 'Social', id: 'LIST' },
            ]
          : [{ type: 'Social', id: 'LIST' }],
    }),
    addPost: builder.mutation<{ success: boolean; item: ContentItem }, Partial<ContentItem>>({
      query: (body) => ({
        url: '/feed',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Feed', id: 'LIST' },
        { type: 'News', id: 'LIST' },
        { type: 'Movie', id: 'LIST' },
        { type: 'Social', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
  useAddPostMutation,
} = contentApi;
