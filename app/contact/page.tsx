import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: '문의하기 | freeconvert',
  description:
    'freeconvert 서비스에 대한 문의사항이나 제안사항을 보내주세요. 빠르고 친절하게 답변드리겠습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/contact`,
  },
  openGraph: {
    title: '문의하기 | freeconvert',
    description:
      'freeconvert 서비스에 대한 문의사항이나 제안사항을 보내주세요. 빠르고 친절하게 답변드리겠습니다.',
    url: `${getBaseUrl()}/contact`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'freeconvert 문의하기',
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 뒤로가기 버튼 */}
        <Link
          href='/'
          className='mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>홈으로 돌아가기</span>
        </Link>

        {/* 제목 */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>문의하기</h1>
          <p className='text-lg text-gray-600'>
            서비스에 대한 문의사항이나 제안사항을 보내주세요
          </p>
        </div>

        {/* 연락처 정보 */}
        <div className='rounded-lg bg-white p-8 shadow-sm mb-8'>
          <section className='mb-8'>
            <h2 className='mb-6 text-2xl font-bold text-gray-900'>
              연락처 정보
            </h2>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-lg border border-gray-200 p-6'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Mail className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    이메일
                  </h3>
                </div>
                <p className='text-gray-600 mb-2'>
                  일반 문의 및 제안사항
                </p>
                <a
                  href='mailto:support@freeconvert.io'
                  className='text-primary hover:underline font-medium'
                >
                  support@freeconvert.io
                </a>
              </div>

              <div className='rounded-lg border border-gray-200 p-6'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <MessageSquare className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    개인정보 보호
                  </h3>
                </div>
                <p className='text-gray-600 mb-2'>
                  개인정보 관련 문의
                </p>
                <a
                  href='mailto:privacy@freeconvert.io'
                  className='text-primary hover:underline font-medium'
                >
                  privacy@freeconvert.io
                </a>
              </div>
            </div>
          </section>

          <section className='mb-8'>
            <div className='rounded-lg border border-gray-200 p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-3'>
                  <Clock className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900'>
                  응답 시간
                </h3>
              </div>
              <p className='text-gray-600'>
                일반적으로 문의하신 내용에 대해 1-2일 이내에 답변드립니다.
                주말 및 공휴일에는 답변이 지연될 수 있습니다.
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              자주 묻는 질문
            </h2>
            <div className='space-y-4'>
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  서비스는 무료인가요?
                </h3>
                <p className='text-gray-600'>
                  네, 기본적인 파일 변환 기능은 모두 무료로 제공됩니다.
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  업로드한 파일은 어떻게 되나요?
                </h3>
                <p className='text-gray-600'>
                  업로드된 파일은 처리 완료 후 즉시 서버에서 삭제됩니다.
                  개인정보 보호를 위해 최선을 다하고 있습니다.
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-2 font-semibold text-gray-900'>
                  어떤 파일 형식을 지원하나요?
                </h3>
                <p className='text-gray-600'>
                  PDF, Word, Excel, PPT, JPG, PNG 등 다양한 파일 형식을
                  지원합니다. 자세한 내용은 각 변환 도구 페이지에서 확인할 수
                  있습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              문의 양식
            </h2>
            <p className='mb-4 text-gray-600'>
              아래 이메일 주소로 문의사항을 보내주시면 빠르게 답변드리겠습니다.
              문의 시 다음 정보를 포함해주시면 더욱 원활한 지원이 가능합니다:
            </p>
            <ul className='mb-4 list-disc list-inside space-y-2 text-gray-600'>
              <li>문의 유형 (기술 지원, 기능 제안, 버그 신고 등)</li>
              <li>문제가 발생한 페이지 또는 기능</li>
              <li>사용 중인 브라우저 및 운영체제</li>
              <li>문제 재현 방법 (가능한 경우)</li>
            </ul>
            <div className='rounded-lg bg-blue-50 p-4'>
              <p className='text-gray-700'>
                <strong>이메일 주소:</strong>{' '}
                <a
                  href='mailto:support@freeconvert.io'
                  className='text-primary hover:underline font-medium'
                >
                  support@freeconvert.io
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* 관련 링크 */}
        <div className='mt-8 flex justify-center gap-4'>
          <Link href='/about' className='text-sm text-primary hover:underline'>
            회사 소개
          </Link>
          <span className='text-gray-300'>|</span>
          <Link href='/privacy' className='text-sm text-gray-600 hover:underline'>
            개인정보처리방침
          </Link>
          <span className='text-gray-300'>|</span>
          <Link href='/terms' className='text-sm text-gray-600 hover:underline'>
            이용약관
          </Link>
          <span className='text-gray-300'>|</span>
          <Link href='/' className='text-sm text-gray-600 hover:underline'>
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
