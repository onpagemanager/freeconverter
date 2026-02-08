/**
 * SEO 관련 유틸리티 함수
 * 모든 페이지에서 공통으로 사용하는 SEO 설정을 관리합니다.
 */

/**
 * 기본 URL을 가져옵니다.
 * 환경 변수 우선순위: NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL > 기본값
 */
export function getBaseUrl(): string {
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
  return baseUrl.replace(/\/$/, '');
}

/**
 * Open Graph 이미지 URL을 생성합니다.
 */
export function getOgImageUrl(path?: string): string {
  const baseUrl = getBaseUrl();
  // Open Graph 이미지가 있다면 해당 경로 사용, 없으면 기본 로고 사용
  return path ? `${baseUrl}${path}` : `${baseUrl}/logo.png`;
}
