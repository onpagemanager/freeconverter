import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '블로그 | ImageConverter',
  description: 'PDF 변환 및 편집에 관한 유용한 블로그 글들을 확인하세요.',
};

// 블로그 포스트 데이터 타입 정의
interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  excerpt: string; // 글 내용 미리보기
}

// 블로그 포스트 데이터 (날짜 역순 정렬)
const blogPosts: BlogPost[] = [
  {
    id: '10',
    title: '여백 없이 PDF 무테두리 인쇄하는 방법',
    description:
      'Smallpdf에서 전체 출혈(full-bleed) 페이지를 준비한 다음 프린터의 무테두리 모드를 사용하여 가장자리까지 인쇄하는 방법을 알아보세요.',
    date: '2025. 10. 7.',
    author: 'David Beníček',
    excerpt:
      'Smallpdf에서 전체 출혈(full-bleed) 페이지를 준비한 다음 프린터의 무테두리 모드를 사용하여 가장자리까지 인쇄할 수 있습니다. 무테두리 인쇄는 대부분의 프린터가 페이지 주변에 남기는 얇은 흰색 테두리를 제거합니다. 핵심은 두 가지입니다. PDF가 실제로 페이지 가장자리까지 도달해야 하고, 프린터가 선택한 용지 크기에 대해 무테두리 설정을 지원해야 합니다...',
  },
  {
    id: '1',
    title: '인터랙티브 문서를 위해 PDF에 비디오 삽입하는 방법',
    description:
      'Smallpdf의 PDF 편집으로 클릭 가능한 썸네일, 링크 또는 QR 코드를 추가하여 PDF에 비디오를 삽입하는 방법을 알아보세요.',
    date: '2025. 10. 6.',
    author: 'Stéphane Turquay',
    excerpt:
      'Smallpdf의 PDF 편집으로 클릭 가능한 썸네일, 링크 또는 QR 코드를 추가한 다음 업데이트된 파일을 저장하고 공유하여 PDF에 비디오를 삽입할 수 있습니다. PDF의 진정한 "삽입된" 멀티미디어는 일부 뷰어에서만 작동하며 파일을 매우 크게 만들 수 있습니다. 가장 신뢰할 수 있는 방법은 PDF에 비디오 썸네일을 배치하고 호스팅된 클립에 연결하는 것입니다...',
  },
  {
    id: '3',
    title: '스캔한 PDF를 똑바로 정렬하는 방법',
    description:
      'Smallpdf로 비뚤어진 페이지를 정렬하고, 기울어진 스캔을 회전하고, 깔끔하게 저장하여 온라인에서 스캔한 PDF를 똑바로 정렬하는 방법을 알아보세요.',
    date: '2025. 9. 30.',
    author: 'David Beníček',
    excerpt:
      'Smallpdf로 비뚤어진 페이지를 정렬하고, 기울어진 스캔을 회전하고, 깔끔하게 저장하여 온라인에서 스캔한 PDF를 똑바로 정렬할 수 있습니다. 스캔한 PDF는 종이가 스캐너에 완벽하게 정렬되지 않았기 때문에 비뚤어진 상태로 나오는 경우가 많습니다. 작은 기울기라도 특히 긴 문서나 법적 파일의 경우 읽기가 더 어려워집니다...',
  },
  {
    id: '4',
    title: '읽기 전용 PDF를 편집하는 방법',
    description:
      '제한을 제거한 다음 Smallpdf의 PDF 편집으로 텍스트, 이미지 또는 주석을 업데이트하여 읽기 전용 PDF를 편집 가능한 파일로 변환하는 방법을 알아보세요.',
    date: '2025. 9. 29.',
    author: 'Stéphane Turquay',
    excerpt:
      '제한을 제거한 다음 Smallpdf의 PDF 편집으로 텍스트, 이미지 또는 주석을 업데이트하여 읽기 전용 PDF를 편집 가능한 파일로 변환할 수 있습니다. 읽기 전용 PDF는 정상적으로 열리지만 변경을 차단합니다. 원인은 작성자가 설정한 권한, 편집을 위한 비밀번호 요구 사항 또는 실제 텍스트가 없는 스캔된 이미지인 파일일 수 있습니다...',
  },
  {
    id: '5',
    title: 'PDF 문서에 투명 스탬프를 추가하는 방법',
    description:
      '투명한 배경이 있는 PNG 이미지를 필요한 곳에 배치하여 모든 PDF에 투명 스탬프를 추가하는 방법을 알아보세요.',
    date: '2025. 9. 12.',
    author: 'Stéphane Turquay',
    excerpt:
      '투명한 배경이 있는 PNG 이미지를 필요한 곳에 배치하여 모든 PDF에 투명 스탬프를 추가할 수 있습니다. 투명 스탬프는 콘텐츠를 가리지 않으면서 파일에 브랜드를 표시하고, 승인을 표시하거나, 서명을 추가하는 데 도움이 됩니다. 로고나 서명을 페이지에 자연스럽게 녹아드는 깨끗한 오버레이로 배치할 수 있습니다...',
  },
  {
    id: '6',
    title: 'PDF 문서에 날짜를 삽입하는 방법',
    description:
      'Smallpdf의 PDF 편집으로 PDF 문서에 날짜를 삽입할 수 있어 오늘 날짜나 필요한 날짜를 쉽게 추가하는 방법을 알아보세요.',
    date: '2025. 9. 11.',
    author: 'David Beníček',
    excerpt:
      'Smallpdf의 PDF 편집으로 PDF 문서에 날짜를 삽입할 수 있어 오늘 날짜나 필요한 날짜를 쉽게 추가할 수 있습니다. 때때로 PDF에 날짜 필드가 없거나 서명된 양식, 송장 또는 계약서를 보내기 전에 날짜를 추가해야 합니다. PDF는 종종 고정된 것으로 인식되지만 간단한 편집기를 사용하여 날짜를 삽입할 수 있습니다...',
  },
  {
    id: '7',
    title: 'PDF 문서의 색상을 변경하는 방법',
    description:
      'Smallpdf의 PDF 편집으로 몇 단계만에 텍스트, 강조 표시, 도형 및 배경의 PDF 색상을 편집하는 방법을 알아보세요.',
    date: '2025. 9. 11.',
    author: 'David Beníček',
    excerpt:
      'Smallpdf의 PDF 편집으로 몇 단계만에 텍스트, 강조 표시, 도형 및 배경의 PDF 색상을 편집할 수 있습니다. 많은 사람들이 PDF가 고정되어 있다고 생각하지만 내부의 색상을 변경할 수 있습니다. PDF 글꼴 색상을 조정하거나, 다른 색조로 체크 표시를 추가하거나, 페이지의 배경색을 변경해야 할 수도 있습니다...',
  },
  {
    id: '8',
    title: '오류 없이 PDF에 사용자 정의 글꼴을 추가하는 방법',
    description:
      'PDF에 사용자 정의 글꼴을 추가하면 파일이 계획한 대로 정확하게 보입니다. 모든 장치에서 오류 없이 명확하고 일관되며 공유하기 쉽습니다.',
    date: '2025. 9. 10.',
    author: 'David Beníček',
    excerpt:
      'PDF에 사용자 정의 글꼴을 추가하면 파일이 계획한 대로 정확하게 보입니다. 모든 장치에서 오류 없이 명확하고 일관되며 공유하기 쉽습니다. 글꼴은 파일과 함께 이동할 수 있도록 삽입되어야 합니다. 삽입하지 않으면 디자인이 다른 장치나 앱에서 다르게 보일 수 있습니다...',
  },
  {
    id: '9',
    title: 'PDF에 배경 이미지를 추가하는 방법',
    description:
      '평범한 PDF는 지루해 보일 수 있으며, 배경 이미지를 추가하면 개성, 브랜딩 및 세련미를 더할 수 있습니다. 몇 단계만으로 수행하는 방법을 알아보세요.',
    date: '2025. 9. 4.',
    author: 'David Beníček',
    excerpt:
      '평범한 PDF는 지루해 보일 수 있으며, 배경 이미지를 추가하면 개성, 브랜딩 및 세련미를 더할 수 있습니다. PDF에 배경 이미지를 추가하면 평범한 문서를 세련되고 전문적인 것으로 변환할 수 있습니다. 브랜딩을 위한 워터마크, 보고서용 회사 로고 또는 프레젠테이션용 전체 페이지 디자인을 생각해 보세요...',
  },
  {
    id: '11',
    title: 'PDF에 서명 이미지를 추가하는 방법',
    description:
      '손으로 쓴 서명 사진을 PDF에 추가하고 싶으신가요? 서명 이미지를 만들고 문서에 삽입하는 방법을 알아보세요.',
    date: '2025. 9. 5.',
    author: 'David Beníček',
    excerpt:
      '손으로 쓴 서명 사진을 PDF에 추가하고 싶으신가요? 서명 이미지를 만들고 문서에 삽입하는 방법을 보여드리겠습니다. 때때로 서명란에 이름을 입력하는 것만으로는 충분히 공식적으로 느껴지지 않습니다. 실제 손으로 쓴 서명 사진을 사용하는 것을 선호할 수 있습니다. 그렇게 하면 PDF가 더 개인적이고, 진정성 있고, 전문적으로 보입니다...',
  },
];

export default function Blogs() {
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
            <li className='text-gray-900 font-medium'>블로그</li>
          </ol>
        </nav>

        {/* 헤더 섹션 - 티스토리 스타일 */}
        <header className='mb-8'>
          <div className='flex items-center justify-between mb-2'>
            <h1 className='text-3xl font-bold text-gray-900'>블로그</h1>
            <span className='text-sm text-gray-500'>
              블로그글갯수{' '}
              <span className='font-semibold'>{blogPosts.length}</span>
            </span>
          </div>
        </header>

        {/* 블로그 포스트 목록 */}
        <article>
          <ul className='space-y-0'>
            {blogPosts.map(post => (
              <li
                key={post.id}
                className='border-b border-gray-200 last:border-b-0'
              >
                <Link
                  href={`/blogs/${post.id}`}
                  className='block p-6 hover:bg-gray-50 transition-colors group'
                >
                  <div className='flex gap-6'>
                    {/* 텍스트 컨텐츠 영역 */}
                    <div className='flex-1 min-w-0'>
                      {/* 제목 */}
                      <h2 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2'>
                        {post.title}
                      </h2>

                      {/* 글 내용 미리보기 */}
                      <div className='mb-4'>
                        <span className='text-sm text-gray-500 mb-1 block'>
                          글 내용
                        </span>
                        <p className='text-gray-700 leading-relaxed line-clamp-3'>
                          {post.excerpt}
                        </p>
                      </div>

                      {/* 메타 정보 */}
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <span>작성시간</span>
                          <time
                            dateTime={post.date
                              .replace(/\./g, '-')
                              .slice(0, -1)}
                          >
                            {post.date}
                          </time>
                        </div>
                        <span className='text-gray-300'>|</span>
                        <span>{post.author} 작성</span>
                      </div>
                    </div>

                    {/* 썸네일 이미지 영역 (선택사항) */}
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

        {/* 빈 상태 (블로그 글이 없을 때) */}
        {blogPosts.length === 0 && (
          <div className='text-center py-16'>
            <p className='text-gray-500 text-lg'>
              아직 작성된 블로그 글이 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
