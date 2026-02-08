import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 편집 | PDF 파일 편집 도구',
  description:
    'PDF 파일을 무료로 편집하세요. 텍스트 추가, 이미지 삽입, 페이지 회전 등 다양한 PDF 편집 기능을 제공합니다.',
  alternates: {
    canonical: `${getBaseUrl()}/edit`,
  },
  openGraph: {
    title: 'PDF 편집 | freeconvert',
    description:
      'PDF 파일을 무료로 편집하세요. 텍스트 추가, 이미지 삽입, 페이지 회전 등 다양한 PDF 편집 기능을 제공합니다.',
    url: `${getBaseUrl()}/edit`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 편집',
      },
    ],
  },
};

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
