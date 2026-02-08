import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 페이지 추출 | PDF에서 특정 페이지 추출',
  description:
    'PDF 파일에서 원하는 페이지만 무료로 추출하세요. PDF 페이지 추출 도구로 특정 페이지 범위를 선택하여 새 PDF로 만들 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/extract-pages`,
  },
  openGraph: {
    title: 'PDF 페이지 추출 | freeconvert',
    description:
      'PDF 파일에서 원하는 페이지만 무료로 추출하세요. PDF 페이지 추출 도구로 특정 페이지 범위를 선택하여 새 PDF로 만들 수 있습니다.',
    url: `${getBaseUrl()}/extract-pages`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 페이지 추출',
      },
    ],
  },
};

export default function ExtractPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
