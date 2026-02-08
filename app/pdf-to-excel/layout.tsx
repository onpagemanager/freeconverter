import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF to Excel 변환기 | PDF를 Excel로 변환',
  description:
    'PDF 파일을 Excel 스프레드시트로 무료 변환하세요. PDF의 표와 데이터를 편집 가능한 Excel 형식으로 변환합니다.',
  alternates: {
    canonical: `${getBaseUrl()}/pdf-to-excel`,
  },
  openGraph: {
    title: 'PDF to Excel 변환기 | freeconvert',
    description:
      'PDF 파일을 Excel 스프레드시트로 무료 변환하세요. PDF의 표와 데이터를 편집 가능한 Excel 형식으로 변환합니다.',
    url: `${getBaseUrl()}/pdf-to-excel`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF to Excel 변환기',
      },
    ],
  },
};

export default function PdfToExcelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
