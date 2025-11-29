import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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

  // 현재 날짜 (lastModified로 사용)
  const currentDate = new Date();

  // 블로그 포스트 ID 목록
  const blogIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // 우선순위와 변경 빈도 설정
  const routes: MetadataRoute.Sitemap = [
    // 메인 페이지
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 변환 도구 페이지들
    {
      url: `${baseUrl}/convert`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-convert`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // PDF로 변환
    {
      url: `${baseUrl}/jpg-to-pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/word-to-pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/excel-to-pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ppt-to-pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // PDF에서 변환
    {
      url: `${baseUrl}/pdf-to-jpg`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-word`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf-to-excel`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf-to-ppt`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // PDF 편집 및 관리 도구
    {
      url: `${baseUrl}/merge`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/split`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rotate`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compress`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/edit`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/annotate`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/delete-pages`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/extract-pages`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pdf-ocr`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 블로그 페이지
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 블로그 포스트들
    ...blogIds.map(id => ({
      url: `${baseUrl}/blogs/${id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // 법적 페이지
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return routes;
}
