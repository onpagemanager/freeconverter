import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: '파일 변환기 | 모든 파일 형식 무료 변환',
  description:
    'PDF, Word, Excel, PowerPoint, 이미지 등 모든 파일 형식을 무료로 변환하세요. 설치 없이 빠르고 안전하게 파일을 변환할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/convert`,
  },
  openGraph: {
    title: '파일 변환기 | freeconvert',
    description:
      'PDF, Word, Excel, PowerPoint, 이미지 등 모든 파일 형식을 무료로 변환하세요. 설치 없이 빠르고 안전하게 파일을 변환할 수 있습니다.',
    url: `${getBaseUrl()}/convert`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: '파일 변환기',
      },
    ],
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
