import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '스캔한 PDF를 똑바로 정렬하는 방법 | ImageConverter',
  description:
    'Smallpdf로 비뚤어진 페이지를 정렬하고, 기울어진 스캔을 회전하고, 깔끔하게 저장하여 온라인에서 스캔한 PDF를 똑바로 정렬하는 방법을 알아보세요.',
  keywords: [
    'PDF 정렬',
    '스캔 PDF 정렬',
    'PDF 회전',
    'PDF 편집',
    '비뚤어진 PDF',
  ],
};

export default function Blog3() {
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
            <li className='text-gray-900 font-medium'>
              스캔한 PDF를 똑바로 정렬하는 방법
            </li>
          </ol>
        </nav>

        {/* 헤더 섹션 */}
        <header className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 leading-tight'>
            스캔한 PDF를 똑바로 정렬하는 방법
          </h1>
          <div className='flex items-center text-sm text-gray-600'>
            <time dateTime='2025-09-30'>2025년 9월 30일</time>
            <span className='mx-2'>|</span>
            <span>David Beníček 작성</span>
          </div>
        </header>

        {/* 소개 섹션 */}
        <div className='mb-8 rounded-lg bg-blue-50 border border-blue-200 p-6'>
          <p className='text-gray-700 leading-relaxed'>
            Smallpdf로 비뚤어진 페이지를 정렬하고, 기울어진 스캔을 회전하고,
            깔끔하게 저장하여 온라인에서 스캔한 PDF를 똑바로 정렬할 수 있습니다.
          </p>
          <p className='mt-4 text-gray-700 leading-relaxed'>
            스캔한 PDF는 종이가 스캐너에 완벽하게 정렬되지 않았기 때문에
            비뚤어진 상태로 나오는 경우가 많습니다. 작은 기울기라도 특히 긴
            문서나 법적 파일의 경우 읽기가 더 어려워집니다.
          </p>
          <p className='mt-4 text-gray-700 leading-relaxed'>
            다시 스캔하는 대신 PDF 페이지를 온라인에서 직접 똑바로 정렬할 수
            있습니다.
          </p>
        </div>

        {/* 본문 섹션 */}
        <article className='prose prose-lg max-w-none'>
          {/* 메인 제목 */}
          <h2 className='text-3xl font-bold text-gray-900 mt-12 mb-6'>
            스캔한 PDF를 똑바로 정렬하는 방법: 단계별 가이드
          </h2>
          <p className='text-gray-700 leading-relaxed mb-8'>
            Smallpdf를 사용하면 몇 초 만에 텍스트를 정렬하고 가독성을 향상시킬
            수 있습니다. 방법은 다음과 같습니다.
          </p>

          {/* 1단계 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              1단계: PDF 열기
            </h3>
            <p className='text-gray-700 leading-relaxed'>
              PDF 편집으로 이동합니다.
            </p>
          </section>

          {/* 2단계 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              2단계: 스캔한 파일 업로드
            </h3>
            <p className='text-gray-700 leading-relaxed'>
              스캔한 PDF를 편집기로 끌어다 놓습니다. Google 드라이브, Dropbox
              또는 OneDrive에서 가져올 수도 있습니다.
            </p>
          </section>

          {/* 3단계 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              3단계: 페이지 회전 또는 정렬
            </h3>
            <p className='text-gray-700 leading-relaxed mb-4'>
              회전 옵션을 사용하여 기울어진 페이지를 정렬합니다. 파일에 여러
              페이지가 있는 경우 각 페이지를 확인하여 똑바로 정렬되었는지
              확인하세요.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              아래에서 볼 수 있듯이 왼쪽 모서리에서 찾을 수 있습니다.
            </p>
          </section>

          {/* 4단계 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              4단계: 업데이트된 PDF 저장
            </h3>
            <p className='text-gray-700 leading-relaxed mb-4'>
              내보내기를 클릭하여 정렬된 파일을 다운로드하거나 클라우드
              스토리지에 다시 저장합니다. 정렬 후 Word에서 편집하는 것을
              선호하는 경우 PDF에서 Word로 문서를 변환할 수도 있습니다.
            </p>
          </section>

          {/* 모바일 장치에서 PDF 페이지 정렬하는 방법 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              모바일 장치에서 PDF 페이지 정렬하는 방법
            </h2>
            <p className='text-gray-700 leading-relaxed mb-4'>
              비뚤어진 PDF는 데스크톱 문제만이 아닙니다. 모바일 스캔 앱도
              페이지를 기울이는 경우가 많습니다. Smallpdf를 사용하면 휴대폰
              브라우저에서 PDF 페이지를 똑바로 정렬할 수 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed mb-4'>
              파일을 업로드하고 정렬되도록 회전한 다음 저장하세요. 추가 앱이
              필요하지 않지만 앱에서 작업하는 것을 선호하는 경우 더 나은 탐색을
              위해 Smallpdf 앱을 다운로드할 수 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              업데이트된 버전을 편안하게 읽으려면 페이지가 수정된 후 깨끗한 보기
              환경을 제공하는 Smallpdf의 PDF 리더를 사용해 보세요.
            </p>
          </section>

          {/* 스캔한 PDF가 비뚤어져 보이는 이유는 무엇인가요 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              스캔한 PDF가 비뚤어져 보이는 이유는 무엇인가요?
            </h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              최고의 스캐너도 비뚤어진 파일을 생성할 수 있습니다. 일반적인
              이유는 다음과 같습니다.
            </p>

            <ul className='space-y-4 text-gray-700 leading-relaxed mb-6'>
              <li className='flex items-start'>
                <span className='mr-3 text-primary font-bold'>•</span>
                <span>문서가 스캐너 유리판에 평평하게 놓이지 않았습니다.</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 text-primary font-bold'>•</span>
                <span>
                  급지 트레이가 약간 비스듬한 각도로 페이지를 당겼습니다.
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 text-primary font-bold'>•</span>
                <span>저해상도 스캔이 작은 기울기를 증폭시켰습니다.</span>
              </li>
            </ul>

            <p className='text-gray-700 leading-relaxed'>
              이런 일이 발생하면 텍스트 줄이 더 이상 똑바로 나타나지 않아
              검토하거나 주석을 추가하기가 더 어려워집니다. 파일을 똑바로
              정렬하면 특히 PDF를 편집하거나 공유할 계획이라면 더 나은 가독성을
              보장합니다.
            </p>
          </section>

          {/* PDF 페이지를 똑바로 정렬하는 대체 방법 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              PDF 페이지를 똑바로 정렬하는 대체 방법
            </h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              PDF 편집이 가장 쉬운 옵션이지만 시도할 수 있는 다른 접근 방식도
              있습니다.
            </p>

            <div className='space-y-6'>
              {/* 방법 1 */}
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  1. Word로 변환 및 편집
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Smallpdf의 PDF를 Word로 변환하여 파일을 변환한 다음 Word에서
                  정렬을 조정한 후 PDF로 다시 내보낼 수 있습니다. 이 방법은 이미
                  텍스트를 편집할 계획이라면 유용합니다.
                </p>
              </div>

              {/* 방법 2 */}
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  2. 보안된 PDF 잠금 해제 및 편집
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  스캔한 PDF가 제한되어 있는 경우 먼저 잠금을 해제해야 할 수
                  있습니다. Smallpdf의 PDF 잠금 해제를 사용하여 조정하기 전에
                  제한을 제거하세요.
                </p>
              </div>

              {/* 방법 3 */}
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  3. 리더에서 페이지 회전
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  때로는 간단한 회전만 필요합니다. Smallpdf의 PDF 리더를
                  사용하면 올바른 각도로 문서를 보고, 회전하고, 다시 저장할 수
                  있습니다.
                </p>
              </div>
            </div>

            <p className='mt-6 text-gray-700 leading-relaxed'>
              이러한 대안은 PDF를 똑바로 정렬하는 방법을 배우는 것이 항상 다시
              스캔하는 것을 의미하지 않는다는 것을 보여줍니다. 온라인 편집 및
              변환은 유연한 옵션을 제공합니다.
            </p>
          </section>

          {/* FAQ 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              자주 묻는 질문
            </h2>

            <div className='space-y-6'>
              {/* FAQ 1 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  1. 다시 스캔하지 않고 스캔한 PDF를 똑바로 정렬하려면 어떻게
                  하나요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Smallpdf의 PDF 편집에 업로드하고 비뚤어진 페이지를 제자리로
                  회전한 다음 업데이트된 파일을 저장하세요.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  2. 휴대폰에서 스캔한 PDF를 똑바로 정렬할 수 있나요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  예. 모바일 브라우저에서 PDF 편집을 열고 파일을 업로드하고
                  페이지를 회전한 다음 똑바로 정렬된 버전을 내보내세요.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  3. PDF 회전과 정렬의 차이점은 무엇인가요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  회전은 페이지를 90도 또는 180도 뒤집습니다. 정렬(기울기
                  제거)은 작은 기울기를 수정하여 텍스트 줄을 수평으로 정렬하여
                  읽기 쉽게 만듭니다.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  4. 여러 페이지 PDF에서 한 페이지만 똑바로 정렬할 수 있나요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  예. PDF 편집에서 조정하려는 특정 페이지를 선택하고 해당
                  페이지만 회전할 수 있습니다.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  5. 스캔한 PDF가 자주 기울어지거나 비뚤어져 보이는 이유는
                  무엇인가요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  종이 정렬 문제, 급지 오류 또는 저해상도 스캔으로 인해 페이지가
                  기울어질 수 있습니다. 스캔 후 정렬하면 이 문제가 해결됩니다.
                </p>
              </div>

              {/* FAQ 6 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  6. 온라인에서 스캔한 PDF를 똑바로 정렬하는 최고의 무료 방법은
                  무엇인가요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Smallpdf를 사용하면 됩니다. 파일을 업로드하고 페이지를 정렬한
                  다음 파일을 다운로드하세요. 무료이고 빠르고 사용하기 쉽습니다.
                </p>
              </div>
            </div>
          </section>
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
