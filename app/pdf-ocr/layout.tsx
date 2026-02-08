import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF OCR | PDF에서 텍스트 추출',
  description:
    'PDF 파일에서 텍스트를 무료로 추출하세요. OCR 기술로 스캔된 PDF나 이미지 PDF에서 텍스트를 인식하고 편집 가능한 형식으로 변환합니다.',
  alternates: {
    canonical: `${getBaseUrl()}/pdf-ocr`,
  },
  openGraph: {
    title: 'PDF OCR | freeconvert',
    description:
      'PDF 파일에서 텍스트를 무료로 추출하세요. OCR 기술로 스캔된 PDF나 이미지 PDF에서 텍스트를 인식하고 편집 가능한 형식으로 변환합니다.',
    url: `${getBaseUrl()}/pdf-ocr`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF OCR',
      },
    ],
  },
};

export default function PdfOcrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
