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
  title: 'JPG PDF 변환 - ImageConverter',
  description:
    '이미지 파일을 고품질 PDF로 변환하세요. JPG, PNG, BMP, GIF, TIFF 형식 지원',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={notoSansKr.className} suppressHydrationWarning>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
