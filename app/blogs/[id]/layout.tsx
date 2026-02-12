import type { Metadata } from 'next';
import { getBaseUrl } from '@/lib/seo';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

/**
 * 블로그 상세 페이지의 메타데이터 생성
 * - canonical URL을 자기 자신(/blogs/{id})으로 설정하여
 *   "Non-canonical page in sitemap" 경고 해결
 */
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/blogs/${id}`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function BlogDetailLayout({ children }: LayoutProps) {
  return children;
}
