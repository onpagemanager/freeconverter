import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 합치기 | 여러 PDF 파일을 하나로 병합',
  description:
    '여러 PDF 파일을 하나로 무료로 합치세요. PDF 병합 도구로 문서를 쉽게 결합하고 순서를 조정할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/merge`,
  },
  openGraph: {
    title: 'PDF 합치기 | freeconvert',
    description:
      '여러 PDF 파일을 하나로 무료로 합치세요. PDF 병합 도구로 문서를 쉽게 결합하고 순서를 조정할 수 있습니다.',
    url: `${getBaseUrl()}/merge`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 합치기',
      },
    ],
  },
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
