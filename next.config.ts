import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16에서는 Turbopack이 기본이므로 webpack을 명시적으로 사용
  // 또는 Turbopack 설정을 추가
  turbopack: {
    // Turbopack 설정이 비어있으면 webpack 사용 허용
  },
  
  // jsPDF는 브라우저 전용 라이브러리이므로 서버 사이드 번들에서 제외
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드에서만 jsPDF를 처리
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  // 성능 최적화 설정
  compress: true, // gzip 압축 활성화
  poweredByHeader: false, // X-Powered-By 헤더 제거 (보안 및 성능)
  
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'], // 최신 이미지 형식 지원
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 이미지 캐시 TTL (초)
  },

  // 실험적 기능 (성능 개선)
  experimental: {
    optimizeCss: true, // CSS 최적화
  },
};

export default nextConfig;
