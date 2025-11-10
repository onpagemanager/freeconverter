import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const notoSansKr = Noto_Sans_KR({
  weight: ['500'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'freeconvert | 무료 이미지 변환기',
    template: '%s | freeconvert',
  },
  description:
    '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다. 설치 없이 빠르고 안전하게 이미지·문서를 변환하세요. 100% 무료로 이용 가능합니다',
  keywords: [
    '무료 이미지 변환',
    '이미지용량줄이기',
    '이미지 to PDF',
    '온라인 파일 변환',
    '무료 PDF 변환기',
    'JPG PNG 변환기',
    'OCR변환',
    '이미지변환사이트',
    '핸드폰사진 변환',
    'PDF 변환',
  ],
  openGraph: {
    type: 'website',
    siteName: 'freeconvert',
    title: 'freeconvert | 무료 이미지 변환기',
    description:
      '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'freeconvert | 무료 이미지 변환기',
    description:
      '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다.',
  },
};

// Organization 스키마 데이터
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'freeconvert',
  url: 'https://freeconvert.io', // 실제 도메인으로 변경 필요
  logo: 'https://freeconvert.io/logo.png', // 로고 이미지 URL (최소 112x112px 권장)
  description:
    '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다.',
  sameAs: [
    // 소셜 미디어 링크가 있다면 추가
    // 예: 'https://www.facebook.com/freeconvert',
    // 'https://twitter.com/freeconvert',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={notoSansKr.className} suppressHydrationWarning>
        {/* Organization 스키마 마크업 */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
