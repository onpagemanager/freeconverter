'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

import type { BlogNotice, Homepage } from '../reference';

const HOMEPAGE_LABEL: Record<Homepage, string> = {
  freeconvert: 'Freeconvert',
  freerecord: 'Freerecord',
};

// 날짜를 한국어 형식으로 포맷팅
const formatKoreanDate = (raw: string) => {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function BlogDetailPage({ params }: PageProps) {
  const [notice, setNotice] = useState<BlogNotice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // params Promise를 React.use()로 해결하여 id 추출
  const resolvedParams = use(params);
  const id = Number.parseInt(resolvedParams.id, 10);

  useEffect(() => {
    // 유효하지 않은 ID 처리
    if (Number.isNaN(id) || id <= 0) {
      setError('유효하지 않은 블로그 ID입니다.');
      setLoading(false);
      return;
    }

    // API를 통해 블로그 글 데이터 가져오기
    const fetchBlogNotice = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/blogs/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('해당 블로그 글을 찾을 수 없습니다.');
          } else {
            const errorData = await response.json();
            setError(
              errorData.message ||
                '블로그 글을 불러오는 중 오류가 발생했습니다.'
            );
          }
          setLoading(false);
          return;
        }

        const result = await response.json();
        setNotice(result.data as BlogNotice);
      } catch (err) {
        console.error('[blog detail] 데이터를 불러오지 못했습니다.', err);
        setError(
          '블로그 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogNotice();
  }, [id]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
        <main className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='text-center py-16'>
            <p className='text-gray-500 text-lg'>블로그 글을 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  // 에러가 발생했을 때
  if (error || !notice) {
    return (
      <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
        <main className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
          <nav className='mb-6 text-sm text-gray-600'>
            <ol className='flex items-center space-x-2'>
              <li>
                <Link href='/' className='hover:text-primary transition-colors'>
                  홈
                </Link>
              </li>
              <li>
                <span className='mx-2'>›</span>
              </li>
              <li>
                <Link
                  href='/blogs'
                  className='hover:text-primary transition-colors'
                >
                  블로그
                </Link>
              </li>
            </ol>
          </nav>

          <div className='rounded-lg bg-red-50 border border-red-200 p-6 text-center'>
            <p className='text-red-700 text-lg mb-4'>
              {error || '블로그 글을 찾을 수 없습니다.'}
            </p>
            <Link
              href='/blogs'
              className='inline-flex items-center text-primary hover:text-blue-700 transition-colors'
            >
              <span className='mr-2'>←</span>
              <span>블로그 목록으로 돌아가기</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 정상적으로 데이터를 불러왔을 때
  return (
    <div className='min-h-screen bg-linear-to-b from-blue-50 to-white'>
      {/* 메인 컨텐츠 */}
      <main className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 브레드크럼 */}
        <nav className='mb-6 text-sm text-gray-600'>
          <ol className='flex items-center space-x-2'>
            <li>
              <Link href='/' className='hover:text-primary transition-colors'>
                홈
              </Link>
            </li>
            <li>
              <span className='mx-2'>›</span>
            </li>
            <li>
              <Link
                href='/blogs'
                className='hover:text-primary transition-colors'
              >
                블로그
              </Link>
            </li>
            <li>
              <span className='mx-2'>›</span>
            </li>
            <li className='text-gray-900 font-medium line-clamp-1'>
              {notice.title}
            </li>
          </ol>
        </nav>

        {/* 헤더 섹션 */}
        <header className='mb-8'>
          {/* 카테고리 및 중요 표시 */}
          <div className='flex flex-wrap items-center gap-2 mb-4'>
            <span className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm'>
              {HOMEPAGE_LABEL[notice.homepage]} · {notice.category}
            </span>
            {notice.highlight && (
              <span className='inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-sm font-medium'>
                중요
              </span>
            )}
          </div>

          <h1 className='mb-4 text-4xl font-bold text-gray-900 leading-tight'>
            {notice.title}
          </h1>
          <div className='flex items-center text-sm text-gray-600'>
            <time dateTime={notice.created_at}>
              {formatKoreanDate(notice.created_at)}
            </time>
            <span className='mx-2'>|</span>
            <span>{HOMEPAGE_LABEL[notice.homepage]} 팀</span>
          </div>
        </header>

        {/* 본문 섹션 */}
        <article className='prose prose-lg max-w-none'>
          {/* 본문 내용 */}
          <div className='mb-8 rounded-lg bg-blue-50 border border-blue-200 p-6'>
            <div className='text-gray-700 leading-relaxed whitespace-pre-line'>
              {notice.content}
            </div>
          </div>
        </article>

        {/* 네비게이션 링크 */}
        <div className='mt-12 pt-8 border-t border-gray-200'>
          <Link
            href='/blogs'
            className='inline-flex items-center text-primary hover:text-blue-700 transition-colors'
          >
            <span className='mr-2'>←</span>
            <span>블로그 목록으로 돌아가기</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
