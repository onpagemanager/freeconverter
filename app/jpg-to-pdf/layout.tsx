import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'JPG to PDF 변환기 | 무료 이미지를 PDF로 변환',
  description:
    'JPG, PNG, GIF 등 이미지 파일을 PDF로 무료 변환하세요. 여러 이미지를 하나의 PDF로 합치거나, 이미지 순서를 조정할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/jpg-to-pdf`,
  },
  openGraph: {
    title: 'JPG to PDF 변환기 | freeconvert',
    description:
      'JPG, PNG, GIF 등 이미지 파일을 PDF로 무료 변환하세요. 여러 이미지를 하나의 PDF로 합치거나, 이미지 순서를 조정할 수 있습니다.',
    url: `${getBaseUrl()}/jpg-to-pdf`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'JPG to PDF 변환기',
      },
    ],
  },
};

export default function JpgToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
