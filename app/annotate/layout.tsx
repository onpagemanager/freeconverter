import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 주석 추가 | PDF에 주석 및 메모 추가',
  description:
    'PDF 파일에 주석과 메모를 무료로 추가하세요. PDF 주석 도구로 텍스트 하이라이트, 메모, 도형 등을 추가할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/annotate`,
  },
  openGraph: {
    title: 'PDF 주석 추가 | freeconvert',
    description:
      'PDF 파일에 주석과 메모를 무료로 추가하세요. PDF 주석 도구로 텍스트 하이라이트, 메모, 도형 등을 추가할 수 있습니다.',
    url: `${getBaseUrl()}/annotate`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 주석 추가',
      },
    ],
  },
};

export default function AnnotateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
