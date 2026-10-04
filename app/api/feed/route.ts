import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedPersonalizedFeed } from '@/src/lib/feedAggregator';
import { INITIAL_MOCK_FEED } from '@/src/data/mockData';
import { ContentItem } from '@/src/types/content';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase().trim() || searchParams.get('q')?.toLowerCase().trim() || '';
    const category = searchParams.get('category') || 'all';
    const type = searchParams.get('type') || 'all';
    const trending = searchParams.get('trending') === 'true';
    const categoriesParam = searchParams.get('categories');
    const typesParam = searchParams.get('types');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const categories = categoriesParam ? categoriesParam.split(',') : [];
    const types = typesParam ? (typesParam.split(',') as any) : [];

    const result = await getUnifiedPersonalizedFeed({
      query,
      category,
      type,
      trending,
      categories,
      types,
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
    console.error('API Error in /api/feed:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.description || !body.category || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem: ContentItem = {
      id: `custom-${Date.now()}`,
      type: body.type,
      category: body.category,
      title: body.title,
      description: body.description,
      content: body.content || '',
      image: body.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      author: {
        name: body.authorName || 'You (Current User)',
        handle: body.authorHandle || '@user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Community Creator',
      },
      publishedAt: new Date().toISOString(),
      isTrending: false,
      metrics: {
        likes: 1,
        shares: 0,
        commentsCount: 0,
      },
      tags: body.tags && Array.isArray(body.tags) ? body.tags : ['UserPost'],
    };

    INITIAL_MOCK_FEED.unshift(newItem);

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error posting item:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
