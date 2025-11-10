import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '오류 없이 PDF에 사용자 정의 글꼴을 추가하는 방법 | ImageConverter',
  description:
    'PDF에 사용자 정의 글꼴을 추가하면 파일이 계획한 대로 정확하게 보입니다. 모든 장치에서 오류 없이 명확하고 일관되며 공유하기 쉽습니다.',
  keywords: [
    'PDF 글꼴 추가',
    'PDF 사용자 정의 글꼴',
    'PDF 글꼴 삽입',
    'PDF 편집',
    'PDF 글꼴 변경',
  ],
};

export default function Blog8() {
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
              오류 없이 PDF에 사용자 정의 글꼴을 추가하는 방법
            </li>
          </ol>
        </nav>

        {/* 헤더 섹션 */}
        <header className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 leading-tight'>
            오류 없이 PDF에 사용자 정의 글꼴을 추가하는 방법
          </h1>
          <div className='flex items-center text-sm text-gray-600'>
            <time dateTime='2025-09-10'>2025년 9월 10일</time>
            <span className='mx-2'>|</span>
            <span>David Beníček 작성</span>
          </div>
        </header>

        {/* 소개 섹션 */}
        <div className='mb-8 rounded-lg bg-blue-50 border border-blue-200 p-6'>
          <p className='text-gray-700 leading-relaxed'>
            PDF에 사용자 정의 글꼴을 추가하면 파일이 계획한 대로 정확하게 보입니다. 모든
            장치에서 오류 없이 명확하고 일관되며 공유하기 쉽습니다.
          </p>
          <p className='mt-4 text-gray-700 leading-relaxed'>
            글꼴은 파일과 함께 이동할 수 있도록 삽입되어야 합니다. 삽입하지 않으면 디자인이
            다른 장치나 앱에서 다르게 보일 수 있습니다.
          </p>
          <p className='mt-4 text-gray-700 leading-relaxed'>
            이 가이드에서는 글꼴을 올바르게 추가하는 방법을 보여드리겠습니다. 디자인
            소프트웨어나 복잡한 설정이 필요하지 않습니다.
          </p>
        </div>

        {/* 본문 섹션 */}
        <article className='prose prose-lg max-w-none'>
          {/* 메인 제목 */}
          <h2 className='text-3xl font-bold text-gray-900 mt-12 mb-6'>
            Word 또는 LibreOffice를 사용하여 PDF에 사용자 정의 글꼴 추가하기
          </h2>

          {/* 1. 시스템에 글꼴이 설치되어 있는지 확인 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              1. 시스템에 글꼴이 설치되어 있는지 확인
            </h3>
            <p className='text-gray-700 leading-relaxed mb-4'>
              먼저 사용하려는 사용자 정의 글꼴이 컴퓨터에 설치되어 있는지 확인하세요.
            </p>
            <ul className='text-gray-700 leading-relaxed space-y-2 mb-4'>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  <strong>Windows에서:</strong> 글꼴 파일을 마우스 오른쪽 버튼으로 클릭하고
                  "설치"를 선택합니다.
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  <strong>macOS에서:</strong> 글꼴 파일을 두 번 클릭한 다음 Font Book 앱에서
                  "글꼴 설치"를 클릭합니다.
                </span>
              </li>
            </ul>
            <p className='text-gray-700 leading-relaxed'>
              <strong>유의사항:</strong> 일부 글꼴에는 삽입을 방지하는 라이선스 제한이
              있습니다. Windows에서는 글꼴 파일을 마우스 오른쪽 버튼으로 클릭하고 "속성"을
              선택한 다음 "세부 정보" 탭에서 글꼴을 삽입할 수 있는지 확인할 수 있습니다.
              macOS에서는 확실하지 않은 경우 글꼴 라이선스를 확인하세요.
            </p>
          </section>

          {/* 2. Word 또는 LibreOffice에서 PDF에 사용자 정의 글꼴 추가 */}
          <section className='mb-8'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              2. Word 또는 LibreOffice에서 PDF에 사용자 정의 글꼴 추가
            </h3>

            <div className='mb-6'>
              <h4 className='text-xl font-bold text-gray-900 mb-3'>
                Word에서 (Windows 및 macOS):
              </h4>
              <ul className='text-gray-700 leading-relaxed space-y-2 mb-4'>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>사용자 정의 글꼴을 사용하여 텍스트를 입력합니다.</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    "저장" 기본 설정을 엽니다(Windows: 파일 &gt; 옵션 &gt; 저장; macOS: Word
                    &gt; 기본 설정 &gt; 저장).
                  </span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>"파일에 글꼴 포함"을 선택합니다.</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    PDF로 내보낼 때 글꼴을 그대로 유지하려면 "인쇄용으로 최적화"를
                    선택합니다.
                  </span>
                </li>
              </ul>
              <p className='text-gray-700 leading-relaxed'>
                <strong>참고:</strong> "인쇄용으로 최적화"를 선택하면 전체 글꼴이 삽입됩니다.
                "전자 배포용으로 최적화"를 선택하면 글꼴의 일부가 누락될 수 있으며 PDF가 모든
                장치에서 올바르게 표시되지 않습니다.
              </p>
            </div>

            <div>
              <h4 className='text-xl font-bold text-gray-900 mb-3'>
                LibreOffice에서:
              </h4>
              <ul className='text-gray-700 leading-relaxed space-y-2'>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>사용자 정의 글꼴을 사용하여 텍스트를 입력합니다.</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>파일 &gt; 다른 이름으로 내보내기 &gt; PDF로 내보내기로 이동합니다.</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-2'>•</span>
                  <span>
                    완료! 최신 버전에서는 글꼴이 자동으로 삽입되므로 추가 설정이 필요하지
                    않습니다.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* PDF에 글꼴을 삽입하는 이유 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              PDF에 글꼴을 삽입하는 이유
            </h2>
            <p className='text-gray-700 leading-relaxed mb-4'>
              비표준 또는 사용자 정의 글꼴을 사용하는 경우 삽입은 중요한 단계입니다. 삽입하지
              않으면 해당 글꼴이 설치되지 않은 장치에서 PDF가 다르게 보일 수 있습니다. 텍스트가
              이동하고, 레이아웃이 깨질 수 있으며, 결과적으로 읽기 어려울 수도 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed mb-4'>
              Arial, Times New Roman 및 Helvetica와 같은 표준 글꼴은 널리 지원되므로 일반적으로
              삽입할 필요가 없습니다.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              처음에 한 번 삽입하면 나중에 표시 오류를 방지하고 파일을 걱정 없이 공유할 수
              있습니다.
            </p>
          </section>

          {/* 사용자 정의 글꼴을 사용하는 PDF를 편집하는 방법 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              사용자 정의 글꼴을 사용하는 PDF를 편집하는 방법
            </h2>
            <p className='text-gray-700 leading-relaxed mb-4'>
              Smallpdf는 Google Docs에 자신의 글꼴을 추가할 수 없는 것처럼 사용자 정의 글꼴을
              설치할 수 없습니다. 그러나 PDF에 이미 사용자 정의 글꼴이 삽입되어 있으면
              Smallpdf가 이를 그대로 유지합니다. 스타일을 잃지 않고 해당 글꼴로 작성된 텍스트를
              편집할 수 있습니다.
            </p>
            <p className='text-gray-700 leading-relaxed mb-6'>
              방법은 다음과 같습니다.
            </p>
            <ul className='text-gray-700 leading-relaxed space-y-2'>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>PDF 편집에서 PDF를 엽니다.</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  PDF의 편집 가능한 텍스트를 클릭합니다. 텍스트가 사용자 정의 글꼴을 사용하는
                  경우 Smallpdf가 이를 보존합니다. (PDF에서 텍스트 편집은 Pro 기능입니다.)
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  단어를 삭제, 추가 또는 조정합니다. 원래 사용자 정의 글꼴이 그대로 유지됩니다.
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  선택 사항: "텍스트 추가"를 클릭하여 새 콘텐츠를 삽입합니다. Smallpdf에서 사용
                  가능한 글꼴 중에서 선택할 수 있습니다. 새 텍스트 블록에는 원래 사용자 정의
                  글꼴을 적용할 수 없습니다.
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  "다운로드"를 클릭하여 업데이트된 PDF를 저장합니다. 기존 사용자 정의 글꼴은
                  삽입된 상태로 유지되며 공유 또는 인쇄할 준비가 됩니다.
                </span>
              </li>
            </ul>
            <p className='mt-4 text-gray-700 leading-relaxed'>
              기억할 가치가 있는 것: Smallpdf Pro를 7일 동안 무료로 사용하여 전체 텍스트 편집
              및 기타 프리미엄 도구를 테스트할 수 있습니다. 맞지 않으면 언제든지 취소하세요.
            </p>
          </section>

          {/* 사용자 정의 글꼴 작업을 위한 추가 팁 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              사용자 정의 글꼴 작업을 위한 추가 팁
            </h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              글꼴 삽입은 일반적으로 간단하지만 나중에 놀라지 않으려면 기억해 둘 만한 몇 가지
              사항이 있습니다.
            </p>
            <ul className='space-y-4 text-gray-700 leading-relaxed'>
              <li className='flex items-start'>
                <span className='mr-3 text-primary font-bold'>•</span>
                <span>
                  일부 글꼴은 무료이든 유료이든 삽입을 방지하는 라이선스 제한이 있습니다.
                  확실하지 않은 경우 항상 글꼴 라이선스를 확인하세요.
                </span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 text-primary font-bold'>•</span>
                <span>
                  가장 간단한 경로를 원한다면 Arial, Times New Roman 또는 Helvetica와 같은
                  일반 글꼴을 사용하세요. 표준 시스템 글꼴은 널리 지원되며 문제를 일으키는 경우가
                  거의 없습니다.
                </span>
              </li>
            </ul>
          </section>

          {/* PDF 편집에 Smallpdf를 사용하는 이유는? 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              PDF 편집에 Smallpdf를 사용하는 이유는?
            </h2>
            <p className='text-gray-700 leading-relaxed mb-6'>
              Smallpdf는 빠르고 쉽고 신뢰할 수 있는 PDF 솔루션을 위한 플랫폼입니다. PDF 편집,
              변환 및 관리를 위한 20개 이상의 도구를 통해 작업 흐름을 단순화하는 데 도움을
              드립니다. 사용자 정의 글꼴로 PDF 편집부터 여러 파일 병합까지 모두 처리합니다.
            </p>
            <p className='text-gray-700 leading-relaxed mb-4'>
              PDF 편집기는 다음을 허용합니다.
            </p>
            <ul className='text-gray-700 leading-relaxed space-y-2'>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>문서의 기존 텍스트 편집</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>도형, 강조 표시 및 그림으로 PDF에 주석 추가</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>편집기에서 사용 가능한 글꼴로 새 텍스트 추가</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>
                  Google 드라이브, OneDrive 또는 Dropbox와 같은 클라우드 서비스에 직접 파일
                  저장
                </span>
              </li>
            </ul>
          </section>

          {/* FAQ 섹션 */}
          <section className='mb-12 mt-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              사용자 정의 글꼴로 PDF 편집에 대한 FAQ
            </h2>

            <div className='space-y-6'>
              {/* FAQ 1 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  1. 자신의 글꼴로 PDF를 편집하는 방법은?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Smallpdf에 사용자 정의 글꼴을 설치할 수 없습니다. 그러나 PDF에 이미 사용자
                  정의 글꼴이 삽입되어 있으면 Smallpdf가 이를 그대로 유지합니다. 스타일을 잃지
                  않고 해당 글꼴로 작성된 텍스트를 편집할 수 있습니다.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  2. PDF 편집기에 글꼴을 추가하는 방법은?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Google Docs와 마찬가지로 Smallpdf에 사용자 정의 글꼴을 직접 추가할 수
                  없습니다. 사용자 정의 글꼴을 사용하려면 먼저 글꼴이 삽입된 Word 또는
                  LibreOffice에서 PDF를 만든 다음 Smallpdf에 업로드하세요.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  3. PDF를 편집할 때 글꼴을 변경할 수 있나요?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  Smallpdf에서 사용 가능한 글꼴로 텍스트를 변경할 수 있습니다. 그러나 새 텍스트
                  블록에 원래 사용자 정의 글꼴을 적용할 수 없습니다. 사용자 정의 글꼴은 파일에
                  이미 삽입된 경우에만 유지됩니다.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className='border border-gray-200 rounded-lg p-6'>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  4. PDF에 사용자 정의 텍스트를 추가하는 방법은?
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  PDF 편집에서 파일을 열고 "텍스트 추가"를 클릭합니다. Smallpdf에서 사용
                  가능한 글꼴을 사용하여 새 콘텐츠를 입력한 다음 업데이트된 PDF를 저장하고
                  다운로드할 수 있습니다.
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

