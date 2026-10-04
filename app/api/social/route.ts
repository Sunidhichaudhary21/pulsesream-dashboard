import { NextRequest, NextResponse } from 'next/server';
import { fetchSocialPosts } from '@/src/lib/socialService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase().trim() || searchParams.get('q')?.toLowerCase().trim() || '';
    const category = searchParams.get('category') || 'all';
    const hashtag = searchParams.get('hashtag') || searchParams.get('tag') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const result = await fetchSocialPosts({
      query,
      category,
      hashtag,
      page,
      pageSize,
    });

    return NextResponse.json({
      items: result.items,
      total: result.total,
      page: result.page,
      pageSize,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error in /api/social:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
