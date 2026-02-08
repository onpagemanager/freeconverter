import type { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'PDF 페이지 삭제 | PDF에서 페이지 제거',
  description:
    'PDF 파일에서 원하는 페이지를 무료로 삭제하세요. PDF 페이지 삭제 도구로 불필요한 페이지를 제거할 수 있습니다.',
  alternates: {
    canonical: `${getBaseUrl()}/delete-pages`,
  },
  openGraph: {
    title: 'PDF 페이지 삭제 | freeconvert',
    description:
      'PDF 파일에서 원하는 페이지를 무료로 삭제하세요. PDF 페이지 삭제 도구로 불필요한 페이지를 제거할 수 있습니다.',
    url: `${getBaseUrl()}/delete-pages`,
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: 'PDF 페이지 삭제',
      },
    ],
  },
};

export default function DeletePagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
