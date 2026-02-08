import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PPT to PDF 변환기 | PowerPoint를 PDF로 변환',
  description:
    'PowerPoint 프레젠테이션을 PDF로 무료 변환하세요. PPT, PPTX 파일을 PDF 형식으로 변환하여 호환성 문제를 해결하세요.',
  alternates: {
    canonical: `${getBaseUrl()}/ppt-to-pdf`,
  },
  openGraph: {
    title: 'PPT to PDF 변환기 | freeconvert',
    description:
      'PowerPoint 프레젠테이션을 PDF로 무료 변환하세요. PPT, PPTX 파일을 PDF 형식으로 변환하여 호환성 문제를 해결하세요.',
    url: `${getBaseUrl()}/ppt-to-pdf`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PPT to PDF 변환기',
      },
    ],
  },
};

export default function PptToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
