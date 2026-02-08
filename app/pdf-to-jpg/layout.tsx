import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF to JPG 변환기 | PDF를 이미지로 변환',
  description:
    'PDF 파일을 JPG 이미지로 무료 변환하세요. PDF의 각 페이지를 고품질 이미지로 추출하여 사용할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/pdf-to-jpg`,
  },
  openGraph: {
    title: 'PDF to JPG 변환기 | freeconvert',
    description:
      'PDF 파일을 JPG 이미지로 무료 변환하세요. PDF의 각 페이지를 고품질 이미지로 추출하여 사용할 수 있습니다.',
    url: `${getBaseUrl()}/pdf-to-jpg`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF to JPG 변환기',
      },
    ],
  },
};

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
