import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF to Word 변환기 | PDF를 Word 문서로 변환',
  description:
    'PDF 파일을 Word 문서로 무료 변환하세요. 편집 가능한 DOC, DOCX 형식으로 변환하여 텍스트를 수정하고 편집할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/pdf-to-word`,
  },
  openGraph: {
    title: 'PDF to Word 변환기 | freeconvert',
    description:
      'PDF 파일을 Word 문서로 무료 변환하세요. 편집 가능한 DOC, DOCX 형식으로 변환하여 텍스트를 수정하고 편집할 수 있습니다.',
    url: `${getBaseUrl()}/pdf-to-word`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF to Word 변환기',
      },
    ],
  },
};

export default function PdfToWordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
