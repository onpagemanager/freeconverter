import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '블로그 | ImageConverter',
  description: '블로그 글',
};

export default function Blog2() {
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
            <li>
              <span className='mx-2'>›</span>
            </li>
            <li className='text-gray-900 font-medium'>블로그</li>
          </ol>
        </nav>

        <header className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 leading-tight'>
            블로그
          </h1>
        </header>

        <div className='text-center py-16'>
          <p className='text-gray-500 text-lg'>콘텐츠 준비 중입니다.</p>
        </div>
      </main>
    </div>
  );
}

