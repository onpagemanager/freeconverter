import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // 공통 함수를 사용하여 baseUrl 가져오기
  const baseUrl = getBaseUrl();

  // 사이트맵 URL 생성 (절대 경로로 보장)
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  return {
    rules: [
      {
        // 모든 크롤러에 대한 기본 규칙
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/Build/', '/404'], // 404 페이지 크롤링 방지
      },
      {
        // Googlebot에 대한 명시적 규칙 (구글 서치 최적화)
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/', '/Build/'],
      },
      {
        // Googlebot-Image (이미지 크롤링용)
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/_next/', '/Build/'],
      },
    ],
    // 사이트맵 URL (절대 경로 필수)
    sitemap: sitemapUrl,
    // 호스트 정보 (선택사항이지만 구글 서치에 도움)
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
}
