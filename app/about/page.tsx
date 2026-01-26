import Link from 'next/link';
import { ArrowLeft, Users, Target, Zap, Shield, Globe } from 'lucide-react';

export const metadata = {
  title: '회사 소개 | freeconvert',
  description:
    'freeconvert는 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기 서비스입니다. PDF, 이미지, 문서 변환을 쉽고 빠르게 제공합니다.',
};

export default function AboutPage() {
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
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            freeconvert 소개
          </h1>
          <p className='text-lg text-gray-600'>
            모든 파일을 무료로 변환하는 온라인 플랫폼
          </p>
        </div>

        {/* 회사 소개 내용 */}
        <div className='rounded-lg bg-white p-8 shadow-sm mb-8'>
          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              우리의 미션
            </h2>
            <p className='mb-4 text-gray-700 leading-relaxed'>
              freeconvert는 누구나 쉽고 빠르게 파일을 변환할 수 있도록 돕는
              것을 목표로 합니다. 복잡한 소프트웨어 설치 없이, 웹 브라우저만
              있으면 언제 어디서나 파일 변환 서비스를 이용할 수 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              우리는 사용자의 편의성을 최우선으로 생각하며, 안전하고 신뢰할 수
              있는 서비스를 제공하기 위해 노력하고 있습니다.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              제공하는 서비스
            </h2>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='rounded-lg border border-gray-200 p-6'>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                  파일 변환
                </h3>
                <p className='text-gray-600'>
                  PDF, Word, Excel, PPT, JPG, PNG 등 다양한 파일 형식을
                  자유롭게 변환할 수 있습니다.
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-6'>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                  PDF 편집
                </h3>
                <p className='text-gray-600'>
                  PDF 합치기, 분할, 회전, 압축, 편집 등 다양한 PDF 작업을
                  제공합니다.
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-6'>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                  이미지 변환
                </h3>
                <p className='text-gray-600'>
                  이미지 형식 변환 및 이미지를 PDF로 변환하는 기능을
                  제공합니다.
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-6'>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                  OCR 기능
                </h3>
                <p className='text-gray-600'>
                  PDF 파일의 텍스트를 추출하고 편집 가능한 문서로 변환합니다.
                </p>
              </div>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              우리의 가치
            </h2>
            <div className='space-y-6'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Zap className='h-6 w-6 text-primary' />
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    빠르고 간편함
                  </h3>
                  <p className='text-gray-600'>
                    복잡한 절차 없이 몇 번의 클릭만으로 파일 변환이 완료됩니다.
                    설치나 회원가입 없이 바로 사용할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Shield className='h-6 w-6 text-primary' />
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    안전과 보안
                  </h3>
                  <p className='text-gray-600'>
                    업로드된 파일은 처리 완료 후 즉시 삭제되며, 개인정보를
                    보호하기 위해 최선을 다하고 있습니다.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Globe className='h-6 w-6 text-primary' />
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    무료 서비스
                  </h3>
                  <p className='text-gray-600'>
                    모든 기본 기능을 무료로 제공하며, 누구나 자유롭게 이용할
                    수 있습니다.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='rounded-lg bg-blue-100 p-3'>
                    <Users className='h-6 w-6 text-primary' />
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    사용자 중심
                  </h3>
                  <p className='text-gray-600'>
                    사용자 피드백을 적극 반영하여 지속적으로 서비스를 개선하고
                    있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              기술과 혁신
            </h2>
            <p className='mb-4 text-gray-700 leading-relaxed'>
              freeconvert는 최신 웹 기술을 활용하여 빠르고 안정적인 서비스를
              제공합니다. 클라우드 기반 인프라를 통해 전 세계 어디서나 동일한
              품질의 서비스를 이용할 수 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              우리는 지속적인 기술 개선과 사용자 경험 향상을 위해 노력하고
              있으며, 앞으로도 더 많은 기능과 더 나은 서비스를 제공하겠습니다.
            </p>
          </section>

          <section>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>
              문의하기
            </h2>
            <p className='mb-4 text-gray-700 leading-relaxed'>
              서비스에 대한 문의사항이나 제안사항이 있으시면 언제든지{' '}
              <Link
                href='/contact'
                className='text-primary hover:underline font-medium'
              >
                문의하기
              </Link>
              페이지를 통해 연락해주세요.
            </p>
          </section>
        </div>

        {/* 관련 링크 */}
        <div className='mt-8 flex justify-center gap-4'>
          <Link
            href='/contact'
            className='text-sm text-primary hover:underline'
          >
            문의하기
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
