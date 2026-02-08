import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: '이미지 변환기 | JPG, PNG, GIF 등 이미지 형식 변환',
  description:
    '이미지 파일 형식을 무료로 변환하세요. JPG, PNG, GIF, BMP, TIFF, WEBP 등 다양한 이미지 형식 간 변환을 지원합니다.',
  alternates: {
    canonical: `${getBaseUrl()}/image-convert`,
  },
  openGraph: {
    title: '이미지 변환기 | freeconvert',
    description:
      '이미지 파일 형식을 무료로 변환하세요. JPG, PNG, GIF, BMP, TIFF, WEBP 등 다양한 이미지 형식 간 변환을 지원합니다.',
    url: `${getBaseUrl()}/image-convert`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: '이미지 변환기',
      },
    ],
  },
};

export default function ImageConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
