'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// 메뉴 항목 타입 정의
type MenuItem = {
  nameKey: string; // 번역 키 사용
  href?: string;
  children?: { nameKey: string; href: string }[];
};

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);

  // 언어 전환 함수
  const switchLocale = (newLocale: 'ko' | 'en') => {
    setLanguage(newLocale);
    setIsLanguageDropdownOpen(false);
  };

  // 메뉴 항목들 (번역 키 사용)
  const menuItems: MenuItem[] = [
    { nameKey: 'menu.compress', href: '/compress' },
    { nameKey: 'menu.convert', href: '/convert' },
    { nameKey: 'menu.image-convert', href: '/image-convert' },
    {
      nameKey: 'menu.organize',
      children: [
        { nameKey: 'menu.merge', href: '/merge' },
        { nameKey: 'menu.split', href: '/split' },
        { nameKey: 'menu.rotate', href: '/rotate' },
        { nameKey: 'menu.delete-pages', href: '/delete-pages' },
        { nameKey: 'menu.extract-pages', href: '/extract-pages' },
      ],
    },
    {
      nameKey: 'menu.view-edit',
      children: [
        { nameKey: 'menu.edit', href: '/edit' },
        { nameKey: 'menu.annotate', href: '/annotate' },
      ],
    },
    {
      nameKey: 'menu.from-pdf',
      children: [
        { nameKey: 'menu.pdf-to-word', href: '/pdf-to-word' },
        { nameKey: 'menu.pdf-to-excel', href: '/pdf-to-excel' },
        { nameKey: 'menu.pdf-to-ppt', href: '/pdf-to-ppt' },
        { nameKey: 'menu.pdf-to-jpg', href: '/pdf-to-jpg' },
      ],
    },
    {
      nameKey: 'menu.to-pdf',
      children: [
        { nameKey: 'menu.word-to-pdf', href: '/word-to-pdf' },
        { nameKey: 'menu.excel-to-pdf', href: '/excel-to-pdf' },
        { nameKey: 'menu.ppt-to-pdf', href: '/ppt-to-pdf' },
        { nameKey: 'menu.jpg-to-pdf', href: '/jpg-to-pdf' },
        { nameKey: 'menu.pdf-ocr', href: '/pdf-ocr' },
      ],
    },
    { nameKey: 'menu.blog', href: '/blogs' },
  ];

  // 드롭다운 열기/닫기
  const handleDropdownToggle = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Link 클릭은 허용하고, 외부 클릭만 처리
      if (target instanceof HTMLElement) {
        // Link 요소나 그 하위 요소인 경우 무시
        if (target.closest('a')) {
          return;
        }
      }

      // 일반 메뉴 드롭다운 처리
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(target)) {
          setOpenDropdown(null);
        }
      });

      // 언어 선택 드롭다운 처리
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='bg-white border-b border-gray-200 shadow-sm relative z-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* 로고 영역 */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center transition-opacity hover:opacity-80'
            >
              <Image
                src='/logo.png'
                alt='freeconvert'
                width={200}
                height={30}
                className='h-10 w-auto'
                priority
              />
            </Link>
          </div>

          {/* 네비게이션 메뉴 (데스크톱) */}
          <nav className='hidden md:flex items-center space-x-1'>
            {menuItems.map(item => {
              if (item.href) {
                // 단일 링크 메뉴
                return (
                  <Link
                    key={item.nameKey}
                    href={item.href}
                    className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-colors'
                  >
                    {t(item.nameKey)}
                  </Link>
                );
              } else if (item.children) {
                // 드롭다운 메뉴
                return (
                  <div
                    key={item.nameKey}
                    ref={el => {
                      dropdownRefs.current[item.nameKey] = el;
                    }}
                    className='relative'
                    onMouseEnter={() => setOpenDropdown(item.nameKey)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => handleDropdownToggle(item.nameKey)}
                      className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1'
                    >
                      {t(item.nameKey)}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.nameKey ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {openDropdown === item.nameKey && (
                      <div
                        className='absolute top-full left-0 w-48 z-50'
                        onMouseEnter={() => setOpenDropdown(item.nameKey)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {/* 버튼과 드롭다운 사이의 연결 영역 (간격을 포함) */}
                        <div className='h-1' />
                        <div className='bg-white border border-gray-200 rounded-lg shadow-lg py-1'>
                          {item.children.map(child => (
                            <Link
                              key={child.nameKey}
                              href={child.href}
                              className='block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors'
                              onClick={e => {
                                // 페이지 이동을 방해하지 않도록 이벤트 전파 허용
                                e.stopPropagation();
                                // 약간의 지연을 두고 드롭다운 닫기 (페이지 이동이 먼저 일어나도록)
                                setTimeout(() => {
                                  setOpenDropdown(null);
                                }, 100);
                              }}
                            >
                              {t(child.nameKey)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </nav>

          {/* 언어 선택 드롭다운 (데스크톱) */}
          <div className='hidden md:block relative' ref={languageDropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-colors'
            >
              <Globe className='h-4 w-4' />
              <span>
                {language === 'ko'
                  ? t('language.korean')
                  : t('language.english')}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isLanguageDropdownOpen && (
              <div className='absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50'>
                <button
                  onClick={() => switchLocale('ko')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === 'ko'
                      ? 'text-primary bg-blue-50 font-medium'
                      : 'text-gray-700 hover:text-primary hover:bg-blue-50'
                  }`}
                >
                  {t('language.korean')}
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === 'en'
                      ? 'text-primary bg-blue-50 font-medium'
                      : 'text-gray-700 hover:text-primary hover:bg-blue-50'
                  }`}
                >
                  {t('language.english')}
                </button>
              </div>
            )}
          </div>

          {/* 언어 선택 및 모바일 메뉴 버튼 */}
          <div className='md:hidden flex items-center gap-2'>
            {/* 언어 선택 버튼 (모바일) */}
            <div className='relative' ref={languageDropdownRef}>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className='flex items-center gap-1 p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none'
              >
                <Globe className='h-5 w-5' />
              </button>
              {isLanguageDropdownOpen && (
                <div className='absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50'>
                  <button
                    onClick={() => switchLocale('ko')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === 'ko'
                        ? 'text-primary bg-blue-50 font-medium'
                        : 'text-gray-700 hover:text-primary hover:bg-blue-50'
                    }`}
                  >
                    {t('language.korean')}
                  </button>
                  <button
                    onClick={() => switchLocale('en')}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === 'en'
                        ? 'text-primary bg-blue-50 font-medium'
                        : 'text-gray-700 hover:text-primary hover:bg-blue-50'
                    }`}
                  >
                    {t('language.english')}
                  </button>
                </div>
              )}
            </div>
            {/* 모바일 메뉴 버튼 */}
            <button
              type='button'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              aria-label='메뉴 열기'
            >
              <svg
                className='h-6 w-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 (드롭다운) */}
        {isMobileMenuOpen && (
          <div className='md:hidden pb-4 border-t border-gray-200'>
            <div className='flex flex-col space-y-1 pt-2'>
              {menuItems.map(item => {
                if (item.href) {
                  // 단일 링크 메뉴
                  return (
                    <Link
                      key={item.nameKey}
                      href={item.href}
                      className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-colors'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(item.nameKey)}
                    </Link>
                  );
                } else if (item.children) {
                  // 드롭다운 메뉴 (모바일)
                  const isOpen = openMobileDropdown === item.nameKey;
                  return (
                    <div key={item.nameKey}>
                      <button
                        onClick={() =>
                          setOpenMobileDropdown(
                            openMobileDropdown === item.nameKey
                              ? null
                              : item.nameKey
                          )
                        }
                        className='w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-colors flex items-center justify-between'
                      >
                        <span>{t(item.nameKey)}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className='pl-6 pt-1 space-y-1'>
                          {item.children.map(child => (
                            <Link
                              key={child.nameKey}
                              href={child.href}
                              className='block px-4 py-2 text-sm text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md transition-colors'
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                            >
                              {t(child.nameKey)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
