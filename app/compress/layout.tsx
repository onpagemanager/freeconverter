import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 압축 | PDF 파일 크기 줄이기',
  description:
    'PDF 파일 크기를 무료로 줄이세요. PDF 압축 도구로 파일 크기를 최적화하여 이메일 전송이나 저장 공간을 절약할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/compress`,
  },
  openGraph: {
    title: 'PDF 압축 | freeconvert',
    description:
      'PDF 파일 크기를 무료로 줄이세요. PDF 압축 도구로 파일 크기를 최적화하여 이메일 전송이나 저장 공간을 절약할 수 있습니다.',
    url: `${getBaseUrl()}/compress`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 압축',
      },
    ],
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
