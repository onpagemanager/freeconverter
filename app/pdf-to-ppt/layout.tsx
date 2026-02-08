import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF to PPT 변환기 | PDF를 PowerPoint로 변환',
  description:
    'PDF 파일을 PowerPoint 프레젠테이션으로 무료 변환하세요. PDF의 각 페이지를 슬라이드로 변환하여 편집할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/pdf-to-ppt`,
  },
  openGraph: {
    title: 'PDF to PPT 변환기 | freeconvert',
    description:
      'PDF 파일을 PowerPoint 프레젠테이션으로 무료 변환하세요. PDF의 각 페이지를 슬라이드로 변환하여 편집할 수 있습니다.',
    url: `${getBaseUrl()}/pdf-to-ppt`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF to PPT 변환기',
      },
    ],
  },
};

export default function PdfToPptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
