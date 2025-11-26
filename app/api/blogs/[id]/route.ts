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

// 수정 가능한 필드만 안전하게 추출
const parseUpdatePayload = (
  payload: Partial<BlogNoticePayload>,
): { success: true; data: Partial<BlogNoticePayload> } | { success: false; message: string } => {
  const updates: Partial<BlogNoticePayload> = {};

  if (payload.homepage !== undefined) {
    if (!isHomepage(payload.homepage)) {
      return { success: false, message: '유효한 homepage 값을 제공해주세요.' };
    }
    updates.homepage = payload.homepage;
  }

  if (payload.category !== undefined) {
    if (!isCategory(payload.category)) {
      return { success: false, message: '유효한 category 값을 제공해주세요.' };
    }
    updates.category = payload.category;
  }

  if (payload.title !== undefined) {
    if (typeof payload.title !== 'string' || payload.title.trim().length === 0) {
      return { success: false, message: 'title은 비어 있을 수 없습니다.' };
    }
    updates.title = payload.title.trim();
  }

  if (payload.content !== undefined) {
    if (typeof payload.content !== 'string' || payload.content.trim().length === 0) {
      return { success: false, message: 'content는 비어 있을 수 없습니다.' };
    }
    updates.content = payload.content.trim();
  }

  if (payload.created_at !== undefined) {
    if (typeof payload.created_at !== 'string' || !isValidDateString(payload.created_at)) {
      return { success: false, message: 'created_at 값이 유효한 날짜가 아닙니다.' };
    }
    updates.created_at = new Date(payload.created_at).toISOString();
  }

  if (payload.highlight !== undefined) {
    updates.highlight = Boolean(payload.highlight);
  }

  if (Object.keys(updates).length === 0) {
    return { success: false, message: '변경할 필드를 한 가지 이상 포함해주세요.' };
  }

  return { success: true, data: updates };
};

// URL 파라미터를 정수 id로 변환
const parseId = (value: string) => {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    return null;
  }
  return id;
};

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  // Next.js 15에서는 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const id = parseId(resolvedParams.id);

  if (!id) {
    return NextResponse.json({ message: '유효한 id 값을 제공해주세요.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { message: '블로그 글을 불러오는 중 오류가 발생했습니다.', details: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ message: '해당 글을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({ data: data as BlogNotice });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  // Next.js 15에서는 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const id = parseId(resolvedParams.id);

  if (!id) {
    return NextResponse.json({ message: '유효한 id 값을 제공해주세요.' }, { status: 400 });
  }

  let body: Partial<BlogNoticePayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'JSON 형식의 요청 본문이 필요합니다.' }, { status: 400 });
  }

  const result = parseUpdatePayload(body);

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  try {
    const adminClient = ensureSupabaseAdmin();
    const { data, error } = await adminClient
      .from(TABLE_NAME)
      .update(result.data)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { message: '블로그 글 수정 중 오류가 발생했습니다.', details: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ message: '해당 글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ data });
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

export async function DELETE(_request: Request, { params }: RouteParams) {
  // Next.js 15에서는 params가 Promise이므로 await로 해결
  const resolvedParams = await params;
  const id = parseId(resolvedParams.id);

  if (!id) {
    return NextResponse.json({ message: '유효한 id 값을 제공해주세요.' }, { status: 400 });
  }

  try {
    const adminClient = ensureSupabaseAdmin();
    const { error } = await adminClient.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { message: '블로그 글 삭제 중 오류가 발생했습니다.', details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: '삭제가 완료되었습니다.' });
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

