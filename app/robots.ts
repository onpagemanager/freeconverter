import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 환경에서는 환경 변수에서 가져오고, 없으면 기본값 사용
  // Vercel 환경 변수 우선순위: NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    // 프로덕션 URL 우선 사용
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else if (process.env.VERCEL_URL) {
      // VERCEL_URL이 이미 https://를 포함하고 있는지 확인
      const vercelUrl = process.env.VERCEL_URL;
      baseUrl = vercelUrl.startsWith('http')
        ? vercelUrl
        : `https://${vercelUrl}`;
    } else {
      // 기본값 (프로덕션 도메인)
      baseUrl = 'https://freeconvert.io';
    }
  }

  // baseUrl이 올바른 형식인지 확인 (http:// 또는 https://로 시작해야 함)
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }

  // 마지막 슬래시 제거
  baseUrl = baseUrl.replace(/\/$/, '');

  // 사이트맵 URL 생성 (절대 경로로 보장)
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  return {
    rules: [
      {
        // 모든 크롤러에 대한 기본 규칙
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/Build/'],
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
