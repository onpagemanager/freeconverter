'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

// HTML lang 속성을 현재 locale에 맞게 업데이트
export default function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return <>{children}</>;
}












