import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 지원하는 언어 목록
export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // locale이 없으면 404
  if (!locale) {
    notFound();
  }

  // 지원하지 않는 언어인 경우 404
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // locale이 확실히 존재함을 보장
  const validLocale: string = locale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});







