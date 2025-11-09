import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 환경에서는 환경 변수에서 가져오고, 없으면 기본값 사용
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://yourdomain.com'; // 실제 도메인으로 변경 필요

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

