import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'freeconvert | 무료 이미지 변환기',
  description:
    '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다. 설치 없이 빠르고 안전하게 이미지·문서를 변환하세요. 100% 무료로 이용 가능합니다',
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: 'freeconvert | 무료 이미지 변환기',
    description:
      '모든파일을 무료 변환합니다. JPG, PNG, PDF 등 모든 파일 형식을 무료로 변환할 수 있는 온라인 변환기입니다.',
    url: getBaseUrl(),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'freeconvert 로고',
      },
    ],
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
