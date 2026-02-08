import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 회전 | PDF 페이지 방향 변경',
  description:
    'PDF 페이지를 무료로 회전하세요. PDF 회전 도구로 페이지 방향을 90도, 180도, 270도로 변경할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/rotate`,
  },
  openGraph: {
    title: 'PDF 회전 | freeconvert',
    description:
      'PDF 페이지를 무료로 회전하세요. PDF 회전 도구로 페이지 방향을 90도, 180도, 270도로 변경할 수 있습니다.',
    url: `${getBaseUrl()}/rotate`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 회전',
      },
    ],
  },
};

export default function RotateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
