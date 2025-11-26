import { NextResponse } from 'next/server';

import { ensureSupabaseAdmin, supabase } from '@/lib/supabase';
import type {
  BlogNotice,
  BlogNoticePayload,
  Category,
  Homepage,
} from '@/app/blogs/reference';

const TABLE_NAME = 'blog_notices';

const HOMEPAGE_VALUES: Homepage[] = ['freeconvert', 'freerecord'];
const CATEGORY_VALUES: Category[] = ['공지', '뉴스', '이벤트', '기타'];

const isHomepage = (value: unknown): value is Homepage =>
  typeof value === 'string' && HOMEPAGE_VALUES.includes(value as Homepage);

const isCategory = (value: unknown): value is Category =>
  typeof value === 'string' && CATEGORY_VALUES.includes(value as Category);

const isValidDateString = (value: string) => !Number.isNaN(Date.parse(value));

// highlight 필터를 위한 Boolean 파서
const parseBoolean = (value: string | null) => {
  if (value === null) return undefined;
  if (['true', '1', 'yes'].includes(value.toLowerCase())) return true;
  if (['false', '0', 'no'].includes(value.toLowerCase())) return false;
  return undefined;
};

// 생성 요청 본문을 검증하고 안전하게 정규화
const parseCreatePayload = (
  payload: Partial<BlogNoticePayload>,
): { success: true; data: BlogNoticePayload } | { success: false; message: string } => {
  if (!isHomepage(payload.homepage)) {
    return { success: false, message: '유효한 homepage 값을 제공해주세요.' };
  }

  if (!isCategory(payload.category)) {
    return { success: false, message: '유효한 category 값을 제공해주세요.' };
  }

  if (typeof payload.title !== 'string' || payload.title.trim().length === 0) {
    return { success: false, message: 'title은 비어 있을 수 없습니다.' };
  }

  if (typeof payload.content !== 'string' || payload.content.trim().length === 0) {
    return { success: false, message: 'content는 비어 있을 수 없습니다.' };
  }

  if (typeof payload.created_at !== 'string' || !isValidDateString(payload.created_at)) {
    return { success: false, message: 'created_at 값이 유효한 날짜가 아닙니다.' };
  }

  return {
    success: true,
    data: {
      homepage: payload.homepage,
      category: payload.category,
      created_at: new Date(payload.created_at).toISOString(),
      title: payload.title.trim(),
      content: payload.content.trim(),
      highlight: Boolean(payload.highlight),
    },
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const homepageParam = searchParams.get('homepage');
  const categoryParam = searchParams.get('category');
  const highlightParam = searchParams.get('highlight');
  const limitParam = searchParams.get('limit');

  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('highlight', { ascending: false })
    .order('created_at', { ascending: false });

  if (homepageParam) {
    query = query.eq('homepage', homepageParam);
  }

  if (categoryParam) {
    query = query.eq('category', categoryParam);
  }

  const highlightFilter = parseBoolean(highlightParam);
  if (typeof highlightFilter === 'boolean') {
    query = query.eq('highlight', highlightFilter);
  }

  if (limitParam) {
    const limit = Number.parseInt(limitParam, 10);
    if (!Number.isNaN(limit) && limit > 0) {
      query = query.limit(Math.min(limit, 100));
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { message: '블로그 글 목록을 가져오는 중 오류가 발생했습니다.', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: data as BlogNotice[] });
}

export async function POST(request: Request) {
  let body: Partial<BlogNoticePayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'JSON 형식의 요청 본문이 필요합니다.' }, { status: 400 });
  }

  const result = parseCreatePayload(body);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  try {
    const adminClient = ensureSupabaseAdmin();
    const { data, error } = await adminClient
      .from(TABLE_NAME)
      .insert(result.data)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: '블로그 글 생성 중 오류가 발생했습니다.', details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: '서버에서 Supabase 자격 증명을 찾을 수 없습니다.',
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

