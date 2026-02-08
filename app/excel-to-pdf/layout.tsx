import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Excel to PDF 변환기 | Excel을 PDF로 변환',
  description:
    'Excel 스프레드시트를 PDF로 무료 변환하세요. XLS, XLSX 파일을 PDF 형식으로 변환하여 공유하기 쉽게 만드세요.',
  alternates: {
    canonical: `${getBaseUrl()}/excel-to-pdf`,
  },
  openGraph: {
    title: 'Excel to PDF 변환기 | freeconvert',
    description:
      'Excel 스프레드시트를 PDF로 무료 변환하세요. XLS, XLSX 파일을 PDF 형식으로 변환하여 공유하기 쉽게 만드세요.',
    url: `${getBaseUrl()}/excel-to-pdf`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'Excel to PDF 변환기',
      },
    ],
  },
};

export default function ExcelToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
