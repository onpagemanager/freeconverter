'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  Download,
  Smartphone,
  Archive,
  ArrowLeftRight,
  MessageSquare,
  FileText,
  List,
  Languages,
  HelpCircle,
  Merge,
  Scissors,
  RotateCw,
  Trash2,
  Grid3x3,
  Edit,
  PenTool,
  BookOpen,
  Hash,
  Crop,
  EyeOff,
  User,
  FileCheck,
  Share2,
  FileType,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  ScanLine,
  Signature,
  Lock,
  LockOpen,
  Download as DownloadIcon,
  Camera,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, language, setLanguage } = useLanguage();

  // 언어 전환 함수
  const switchLocale = (newLocale: 'ko' | 'en') => {
    setLanguage(newLocale);
  };

  // PDF 도구 메뉴 데이터
  const toolCategories = [
    {
      // Column 1
      categories: [
        {
          name: language === 'ko' ? '압축하기' : 'Compress',
          tools: [
            {
              name: language === 'ko' ? 'PDF 압축' : 'Compress PDF',
              href: '/compress',
              icon: Archive,
              color: 'text-red-500',
            },
          ],
        },
        {
          name: language === 'ko' ? '변환하기' : 'Convert',
          tools: [
            {
              name: language === 'ko' ? 'PDF 변환기' : 'PDF Converter',
              href: '/convert',
              icon: ArrowLeftRight,
              color: 'text-red-500',
            },
          ],
        },
        {
          name: language === 'ko' ? 'AI PDF' : 'AI PDF',
          tools: [
            {
              name: language === 'ko' ? 'PDF와 채팅' : 'Chat with PDF',
              href: '/chat-pdf',
              icon: MessageSquare,
              color: 'text-blue-500',
            },
            {
              name:
                language === 'ko' ? 'AI PDF 요약 도구' : 'AI PDF Summary Tool',
              href: '/ai-summary',
              icon: List,
              color: 'text-blue-500',
            },
            {
              name: language === 'ko' ? 'PDF 번역' : 'Translate PDF',
              href: '/translate-pdf',
              icon: Languages,
              color: 'text-blue-500',
            },
            {
              name:
                language === 'ko' ? 'AI 문제 생성기' : 'AI Problem Generator',
              href: '/ai-problem',
              icon: HelpCircle,
              color: 'text-blue-500',
            },
          ],
        },
      ],
    },
    {
      // Column 2
      categories: [
        {
          name: language === 'ko' ? '정리' : 'Organize',
          tools: [
            {
              name: language === 'ko' ? 'PDF 합치기' : 'Merge PDF',
              href: '/merge',
              icon: Merge,
              color: 'text-purple-500',
            },
            {
              name: language === 'ko' ? 'PDF 분할' : 'Split PDF',
              href: '/split',
              icon: Scissors,
              color: 'text-purple-500',
            },
            {
              name: language === 'ko' ? 'PDF 회전' : 'Rotate PDF',
              href: '/rotate',
              icon: RotateCw,
              color: 'text-purple-500',
            },
            {
              name: language === 'ko' ? 'PDF 페이지 삭제' : 'Delete PDF Pages',
              href: '/delete-pages',
              icon: Trash2,
              color: 'text-purple-500',
            },
            {
              name: language === 'ko' ? 'PDF 페이지 추출' : 'Extract PDF Pages',
              href: '/extract-pages',
              icon: Grid3x3,
              color: 'text-purple-500',
            },
            {
              name: language === 'ko' ? 'PDF 정리' : 'Organize PDF',
              href: '/organize',
              icon: Grid3x3,
              color: 'text-purple-500',
            },
          ],
        },
      ],
    },
    {
      // Column 3
      categories: [
        {
          name: language === 'ko' ? '보기 및 편집' : 'View & Edit',
          tools: [
            {
              name: language === 'ko' ? 'PDF 편집' : 'Edit PDF',
              href: '/edit',
              icon: Edit,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 주석 도구' : 'PDF Annotate Tool',
              href: '/annotate',
              icon: PenTool,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 리더' : 'PDF Reader',
              href: '/reader',
              icon: BookOpen,
              color: 'text-teal-500',
            },
            {
              name:
                language === 'ko' ? '페이지 번호 매기기' : 'Add Page Numbers',
              href: '/page-numbers',
              icon: Hash,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 자르기' : 'Crop PDF',
              href: '/crop',
              icon: Crop,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 기밀 정보 삭제' : 'Redact PDF',
              href: '/redact',
              icon: EyeOff,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? '워터마크 PDF' : 'Watermark PDF',
              href: '/watermark',
              icon: User,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 양식 필러' : 'PDF Form Filler',
              href: '/form-filler',
              icon: FileCheck,
              color: 'text-teal-500',
            },
            {
              name: language === 'ko' ? 'PDF 공유하기' : 'Share PDF',
              href: '/share',
              icon: Share2,
              color: 'text-teal-500',
            },
          ],
        },
      ],
    },
    {
      // Column 4
      categories: [
        {
          name: language === 'ko' ? 'PDF에서 변환' : 'Convert from PDF',
          tools: [
            {
              name: language === 'ko' ? 'PDF 워드 변환' : 'PDF to Word',
              href: '/pdf-to-word',
              icon: FileType,
              color: 'text-blue-500',
            },
            {
              name: language === 'ko' ? 'PDF 엑셀 변환' : 'PDF to Excel',
              href: '/pdf-to-excel',
              icon: FileSpreadsheet,
              color: 'text-green-500',
            },
            {
              name: language === 'ko' ? 'PDF PPT변환' : 'PDF to PPT',
              href: '/pdf-to-ppt',
              icon: Presentation,
              color: 'text-orange-500',
            },
            {
              name: language === 'ko' ? 'PDF JPG 변환' : 'PDF to JPG',
              href: '/pdf-to-jpg',
              icon: ImageIcon,
              color: 'text-yellow-500',
            },
          ],
        },
        {
          name: language === 'ko' ? 'PDF로 변환' : 'Convert to PDF',
          tools: [
            {
              name: language === 'ko' ? '워드 PDF 변환' : 'Word to PDF',
              href: '/word-to-pdf',
              icon: FileType,
              color: 'text-blue-500',
            },
            {
              name: language === 'ko' ? '엑셀 PDF 변환' : 'Excel to PDF',
              href: '/excel-to-pdf',
              icon: FileSpreadsheet,
              color: 'text-green-500',
            },
            {
              name: language === 'ko' ? 'PPT PDF 변환' : 'PPT to PDF',
              href: '/ppt-to-pdf',
              icon: Presentation,
              color: 'text-orange-500',
            },
            {
              name: language === 'ko' ? 'JPG PDF 변환' : 'JPG to PDF',
              href: '/jpg-to-pdf',
              icon: ImageIcon,
              color: 'text-yellow-500',
            },
            {
              name: language === 'ko' ? 'PDF OCR 변환' : 'PDF OCR Convert',
              href: '/pdf-ocr',
              icon: ScanLine,
              color: 'text-red-500',
            },
          ],
        },
      ],
    },
    {
      // Column 5
      categories: [
        {
          name: language === 'ko' ? '서명' : 'Sign',
          tools: [
            {
              name: language === 'ko' ? 'PDF에 서명' : 'Sign PDF',
              href: '/sign',
              icon: Signature,
              color: 'text-purple-500',
              highlighted: true,
            },
            {
              name:
                language === 'ko'
                  ? '서명 요청 (Sign.com)'
                  : 'Request Signature (Sign.com)',
              href: '/sign-request',
              icon: PenTool,
              color: 'text-yellow-500',
            },
          ],
        },
        {
          name: language === 'ko' ? '더 보기' : 'More',
          tools: [
            {
              name: language === 'ko' ? 'PDF 잠금해제' : 'Unlock PDF',
              href: '/unlock',
              icon: LockOpen,
              color: 'text-red-500',
            },
            {
              name: language === 'ko' ? 'PDF 암호 설정' : 'Protect PDF',
              href: '/protect',
              icon: Lock,
              color: 'text-red-500',
            },
            {
              name: language === 'ko' ? 'PDF 평면화' : 'Flatten PDF',
              href: '/flatten',
              icon: DownloadIcon,
              color: 'text-red-500',
            },
          ],
        },
        {
          name: language === 'ko' ? '스캔' : 'Scan',
          tools: [
            {
              name: language === 'ko' ? 'PDF 스캐너' : 'PDF Scanner',
              href: '/scanner',
              icon: Camera,
              color: 'text-blue-500',
            },
          ],
        },
      ],
    },
  ];

  return (
    <footer className='bg-white border-t border-gray-200'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* PDF 도구 메뉴 섹션 */}
        <div className='mb-12 border-b border-gray-200 pb-12'>
          <div className='grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5'>
            {toolCategories.map((column, columnIndex) => (
              <div key={columnIndex} className='space-y-6'>
                {column.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>
                      {category.name}
                    </h3>
                    <ul className='space-y-2'>
                      {category.tools.map((tool, toolIndex) => {
                        const Icon = tool.icon;
                        return (
                          <li key={toolIndex}>
                            <Link
                              href={tool.href}
                              className={`flex items-center gap-2 text-sm transition-colors ${
                                tool.highlighted
                                  ? 'bg-blue-50 px-2 py-1 rounded hover:bg-blue-100'
                                  : 'hover:text-gray-900'
                              } ${
                                tool.highlighted
                                  ? 'text-gray-900'
                                  : 'text-gray-600'
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 flex-shrink-0 ${tool.color}`}
                              />
                              <span className='line-clamp-1'>{tool.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 상단 섹션: 로고 및 네비게이션 */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 mb-12'>
          {/* 로고 및 슬로건 */}
          <div className='lg:col-span-1'>
            <Link href='/' className='flex items-center gap-2 mb-4'>
              {/* 로고 - 다양한 색상의 사각형들 */}
              <Image
                src='/logo.png'
                alt='freeconvert'
                width={200}
                height={30}
                className='h-10 w-auto'
                priority
              />
            </Link>
            <p className='text-sm text-gray-600'>
              {language === 'ko'
                ? '우리는 PDF를 쉽게 만듭니다.'
                : 'We make PDFs easy.'}
            </p>
          </div>

          {/* 솔루션 */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              {language === 'ko' ? '솔루션' : 'Solutions'}
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/education'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '교육' : 'Education'}
                </Link>
              </li>
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              {language === 'ko' ? '회사' : 'Company'}
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? 'Freeconvert 소개' : 'About Freeconvert'}
                </Link>
              </li>
              <li>
                <Link
                  href='/help'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '도움말' : 'Help'}
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '블로그' : 'Blog'}
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '채용' : 'Careers'}
                </Link>
              </li>
            </ul>
          </div>

          {/* 제품 */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              {language === 'ko' ? '제품' : 'Product'}
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/pricing'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '이용 요금' : 'Pricing'}
                </Link>
              </li>
              <li>
                <Link
                  href='/team'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? '팀' : 'Team'}
                </Link>
              </li>
              <li>
                <Link
                  href='/developers'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>

          {/* 앱 */}
          <div className=''>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>
              {language === 'ko' ? '앱' : 'App'}
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/download'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko'
                    ? 'Freeconvert 다운로드'
                    : 'Freeconvert Download'}
                </Link>
              </li>
              <li>
                <Link
                  href='/scanner'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? 'PDF 스캐너' : 'PDF Scanner'}
                </Link>
              </li>
              <li>
                <Link
                  href='/windows-app'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  {language === 'ko' ? 'Windows 앱' : 'Windows App'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 섹션: 소셜 미디어, 저작권, 앱 다운로드 */}
        <div className='border-t border-gray-200 pt-8 w-full'>
          <div className='flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            {/* 소셜 미디어 및 저작권 */}
            <div className='flex flex-col gap-4 w-full'>
              {/* 소셜 미디어 아이콘 */}
              <div className='flex items-center gap-4'>
                <a
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='h-5 w-5' />
                </a>
                <a
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  aria-label='Facebook'
                >
                  <Facebook className='h-5 w-5' />
                </a>
                <a
                  href='https://youtube.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  aria-label='YouTube'
                >
                  <Youtube className='h-5 w-5' />
                </a>
                <a
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                  aria-label='Twitter'
                >
                  <Twitter className='h-5 w-5' />
                </a>
              </div>

              {/* 연락처 정보 */}
              <div className='mb-4 text-sm text-gray-600'>
                <p className='mb-2'>
                  <strong className='text-gray-900'>
                    {language === 'ko' ? '연락처' : 'Contact'}
                  </strong>
                </p>
                <p className='mb-1'>
                  {language === 'ko' ? '이메일' : 'Email'}:{' '}
                  <a
                    href='mailto:support@freeconvert.io'
                    className='text-primary hover:underline'
                  >
                    support@freeconvert.io
                  </a>
                </p>
                <p>
                  {language === 'ko' ? '개인정보 문의' : 'Privacy Inquiry'}:{' '}
                  <a
                    href='mailto:privacy@freeconvert.io'
                    className='text-primary hover:underline'
                  >
                    privacy@freeconvert.io
                  </a>
                </p>
              </div>

              {/* 저작권 및 법률 링크 */}
              <div className='flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600'>
                <p>&copy; 2025 Freeconvert. {language === 'ko' ? '모든 권리 보유.' : 'All rights reserved.'}</p>
                <div className='flex flex-wrap gap-4'>
                  <Link
                    href='/about'
                    className='hover:text-gray-900 transition-colors'
                  >
                    {language === 'ko' ? '회사 소개' : 'About'}
                  </Link>
                  <Link
                    href='/privacy'
                    className='hover:text-gray-900 transition-colors'
                  >
                    {language === 'ko' ? '개인정보 보호정책' : 'Privacy Policy'}
                  </Link>
                  <Link
                    href='/terms'
                    className='hover:text-gray-900 transition-colors'
                  >
                    {language === 'ko' ? '이용약관' : 'Terms of Service'}
                  </Link>
                  <Link
                    href='/contact'
                    className='hover:text-gray-900 transition-colors'
                  >
                    {language === 'ko' ? '문의하기' : 'Contact Us'}
                  </Link>
                  <div className='relative'>
                    <button
                      onClick={() =>
                        switchLocale(language === 'ko' ? 'en' : 'ko')
                      }
                      className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors'
                    >
                      <Globe className='h-4 w-4' />
                      <span>{language === 'ko' ? '한국어' : 'English'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
