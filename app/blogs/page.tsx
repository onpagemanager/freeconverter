import type { Metadata } from 'next';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';
import type { BlogNotice, Homepage } from './reference';

export const metadata: Metadata = {
  title: '블로그 | freeconvert',
  description: 'PDF 변환 및 편집에 관한 유용한 블로그 글들을 확인하세요.',
};

export const revalidate = 60;

const HOMEPAGE_LABEL: Record<Homepage, string> = {
  freeconvert: 'Freeconvert',
  freerecord: 'Freerecord',
};

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

const createExcerpt = (content: string, maxLength = 180) => {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength)}...`;
};

// Supabase에서 공지 데이터를 서버에서 바로 로드
const fetchBlogNotices = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_notices')
      .select('id, title, content, category, homepage, created_at, highlight')
      .order('highlight', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      notices: (data ?? []) as BlogNotice[],
      errorMessage: null,
    };
  } catch (error) {
    console.error('[blogs] 데이터를 불러오지 못했습니다.', error);
    return {
      notices: [] as BlogNotice[],
      errorMessage:
        '블로그 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
};

export default async function Blogs() {
  const { notices, errorMessage } = await fetchBlogNotices();

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
            <li className='text-gray-900 font-medium'>블로그</li>
          </ol>
        </nav>

        <header className='mb-8'>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='text-3xl font-bold text-gray-900'>블로그</h1>
            <span className='text-sm text-gray-500'>
              블로그글갯수{' '}
              <span className='font-semibold'>{notices.length}</span>
            </span>
          </div>
          <p className='text-gray-600'>
            최신 공지와 기능 업데이트를 한 번에 확인하세요. 중요 공지는 목록
            상단에 노출됩니다.
          </p>
        </header>

        {errorMessage ? (
          <div className='rounded-lg bg-red-50 border border-red-200 p-4 text-red-700'>
            {errorMessage}
          </div>
        ) : (
          <>
            <article>
              <ul className='space-y-0'>
                {notices.map(post => (
                  <li
                    key={post.id}
                    className='border-b border-gray-200 last:border-b-0'
                  >
                    <Link
                      href={`/blogs/${post.id}`}
                      className='block p-6 hover:bg-gray-50 transition-colors group'
                    >
                      <div className='flex gap-6'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2'>
                            <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5'>
                              {HOMEPAGE_LABEL[post.homepage]} · {post.category}
                            </span>
                            {post.highlight && (
                              <span className='inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-medium'>
                                중요
                              </span>
                            )}
                          </div>

                          <h2 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2'>
                            {post.title}
                          </h2>

                          <div className='mb-4'>
                            <span className='text-sm text-gray-500 mb-1 block'>
                              글 내용
                            </span>
                            <p className='text-gray-700 leading-relaxed line-clamp-3'>
                              {createExcerpt(post.content)}
                            </p>
                          </div>

                          <div className='flex items-center gap-4 text-sm text-gray-500'>
                            <div className='flex items-center gap-1'>
                              <span>작성시간</span>
                              <time dateTime={post.created_at}>
                                {formatKoreanDate(post.created_at)}
                              </time>
                            </div>
                            <span className='text-gray-300'>|</span>
                            <span>{HOMEPAGE_LABEL[post.homepage]} 팀</span>
                          </div>
                        </div>

                        <div className='hidden sm:block shrink-0'>
                          <div className='w-32 h-24 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center'>
                            <svg
                              className='w-12 h-12 text-blue-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z'
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            {notices.length === 0 && (
              <div className='text-center py-16'>
                <p className='text-gray-500 text-lg'>
                  아직 작성된 블로그 글이 없습니다.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
