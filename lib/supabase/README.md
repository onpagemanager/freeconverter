# Supabase 연동 가이드

## 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Supabase 키 확인 방법:**
1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. Settings > API 메뉴로 이동
4. `Project URL`과 `anon public` 키를 복사

## 2. 사용 방법

### 클라이언트 컴포넌트에서 사용

```tsx
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function ClientComponent() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabaseClient();
      
      // 데이터 조회 예시
      const { data, error } = await supabase
        .from('your_table')
        .select('*');

      if (error) {
        console.error('에러:', error);
      } else {
        setData(data || []);
      }
    }

    fetchData();
  }, []);

  return <div>{/* 데이터 표시 */}</div>;
}
```

### 서버 컴포넌트에서 사용

```tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createSupabaseServerClient();
  
  // 데이터 조회
  const { data, error } = await supabase
    .from('your_table')
    .select('*');

  if (error) {
    console.error('에러:', error);
  }

  return <div>{/* 데이터 표시 */}</div>;
}
```

### API 라우트에서 사용

```tsx
// app/api/example/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('your_table')
      .select('*');

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: '데이터 조회 실패' },
      { status: 500 }
    );
  }
}
```

### 인증 사용 예시

```tsx
'use client';

import { createSupabaseClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function AuthExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('회원가입 실패:', error.message);
    } else {
      console.log('회원가입 성공:', data);
    }
  };

  const handleSignIn = async () => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('로그인 실패:', error.message);
    } else {
      console.log('로그인 성공:', data);
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
  };

  return (
    <div>
      {/* 폼 UI */}
    </div>
  );
}
```

## 3. 미들웨어 설정 (선택사항)

인증이 필요한 페이지를 보호하려면 `middleware.ts` 파일을 생성하세요:

```typescript
// middleware.ts (프로젝트 루트)
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## 4. 주요 기능

- **클라이언트 컴포넌트**: `createSupabaseClient()` 사용
- **서버 컴포넌트**: `createSupabaseServerClient()` 사용
- **관리자 작업**: `createSupabaseAdminClient()` 사용 (RLS 우회, 신중하게 사용)

## 5. 보안 주의사항

- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에 노출됩니다
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에 노출하면 안 됩니다
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다



