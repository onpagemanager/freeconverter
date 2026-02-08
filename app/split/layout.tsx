import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 분할 | PDF 파일을 여러 개로 나누기',
  description:
    'PDF 파일을 여러 개로 무료로 나누세요. PDF 분할 도구로 원하는 페이지만 추출하거나 여러 파일로 분할할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/split`,
  },
  openGraph: {
    title: 'PDF 분할 | freeconvert',
    description:
      'PDF 파일을 여러 개로 무료로 나누세요. PDF 분할 도구로 원하는 페이지만 추출하거나 여러 파일로 분할할 수 있습니다.',
    url: `${getBaseUrl()}/split`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 분할',
      },
    ],
  },
};

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
