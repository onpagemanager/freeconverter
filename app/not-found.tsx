import Link from 'next/link';
import { Home, Search, FileText } from 'lucide-react';

export const metadata = {
  title: '404 - 페이지를 찾을 수 없습니다 | 무료 이미지 변환기',
  description: '요청하신 페이지를 찾을 수 없습니다.',
};

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center'>
        {/* 404 숫자 */}
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-primary opacity-20'>404</h1>
        </div>

        {/* 메시지 */}
        <div className='mb-12'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            페이지를 찾을 수 없습니다
          </h2>
          <p className='text-lg text-gray-600'>
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 다시 확인해주세요.
          </p>
        </div>

        {/* 주요 링크 */}
        <div className='grid gap-4 sm:grid-cols-3 mb-12'>
          <Link
            href='/'
            className='group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
          >
            <div className='mb-3 flex justify-center'>
              <div className='rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors'>
                <Home className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              홈으로
            </h3>
            <p className='text-sm text-gray-600'>
              메인 페이지로 돌아가기
            </p>
          </Link>

          <Link
            href='/convert'
            className='group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
          >
            <div className='mb-3 flex justify-center'>
              <div className='rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors'>
                <FileText className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              파일 변환
            </h3>
            <p className='text-sm text-gray-600'>
              파일 변환 도구 사용하기
            </p>
          </Link>

          <Link
            href='/jpg-to-pdf'
            className='group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
          >
            <div className='mb-3 flex justify-center'>
              <div className='rounded-lg bg-blue-100 p-3 group-hover:bg-blue-200 transition-colors'>
                <Search className='h-6 w-6 text-primary' />
              </div>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              인기 도구
            </h3>
            <p className='text-sm text-gray-600'>
              JPG to PDF 변환
            </p>
          </Link>
        </div>

        {/* 빠른 링크 */}
        <div className='border-t border-gray-200 pt-8'>
          <p className='mb-4 text-sm font-medium text-gray-700'>
            인기 서비스
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Link
              href='/jpg-to-pdf'
              className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors'
            >
              JPG to PDF
            </Link>
            <Link
              href='/pdf-to-word'
              className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors'
            >
              PDF to Word
            </Link>
            <Link
              href='/merge'
              className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors'
            >
              PDF 합치기
            </Link>
            <Link
              href='/compress'
              className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors'
            >
              PDF 압축
            </Link>
            <Link
              href='/edit'
              className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors'
            >
              PDF 편집
            </Link>
          </div>
        </div>

        {/* 도움말 */}
        <div className='mt-8 text-sm text-gray-500'>
          <p>
            문제가 계속되면{' '}
            <Link href='/terms' className='text-primary hover:underline'>
              이용약관
            </Link>
            을 확인하거나 고객센터로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

