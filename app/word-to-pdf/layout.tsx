import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Word to PDF 변환기 | Word 문서를 PDF로 변환',
  description:
    'Word 문서를 PDF로 무료 변환하세요. DOC, DOCX 파일을 PDF 형식으로 변환하여 호환성 문제를 해결하고 공유하기 쉽게 만드세요.',
  alternates: {
    canonical: `${getBaseUrl()}/word-to-pdf`,
  },
  openGraph: {
    title: 'Word to PDF 변환기 | freeconvert',
    description:
      'Word 문서를 PDF로 무료 변환하세요. DOC, DOCX 파일을 PDF 형식으로 변환하여 호환성 문제를 해결하고 공유하기 쉽게 만드세요.',
    url: `${getBaseUrl()}/word-to-pdf`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'Word to PDF 변환기',
      },
    ],
  },
};

export default function WordToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
