# Supabase 연동 가이드

## 📋 단계별 설정 가이드

### 1단계: 패키지 설치 ✅

다음 패키지들이 이미 설치되었습니다:
- `@supabase/supabase-js`
- `@supabase/ssr`

### 2단계: Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입 및 로그인
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 선택
4. 프로젝트 생성 완료 대기 (약 2분 소요)

### 3단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon/Public Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (서버 사이드 전용, 선택사항)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**키 확인 방법:**
1. Supabase 대시보드에서 프로젝트 선택
2. Settings > API 메뉴로 이동
3. 다음 정보를 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 입력
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력
   - **service_role** 키 → `SUPABASE_SERVICE_ROLE_KEY`에 입력 (선택사항)

### 4단계: 파일 구조 확인

다음 파일들이 생성되었습니다:

```
lib/
  supabase/
    client.ts      # 클라이언트 컴포넌트용
    server.ts      # 서버 컴포넌트/API 라우트용
    middleware.ts  # 미들웨어용
    README.md      # 상세 사용 가이드
```

### 5단계: 사용 예시

#### 클라이언트 컴포넌트에서 사용

```tsx
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function ExamplePage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabaseClient();
      
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

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### 서버 컴포넌트에서 사용

```tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ServerPage() {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*');

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### 인증 사용 예시

```tsx
'use client';

import { createSupabaseClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('회원가입 실패: ' + error.message);
    } else {
      alert('회원가입 성공! 이메일 확인을 해주세요.');
    }
  };

  const handleSignIn = async () => {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else {
      alert('로그인 성공!');
      // 로그인 후 리다이렉트 등 처리
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      alert('로그아웃 실패: ' + error.message);
    } else {
      alert('로그아웃 성공!');
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button onClick={handleSignUp}>회원가입</button>
      <button onClick={handleSignIn}>로그인</button>
      <button onClick={handleSignOut}>로그아웃</button>
    </div>
  );
}
```

### 6단계: 미들웨어 설정 (선택사항)

인증이 필요한 페이지를 보호하려면 프로젝트 루트에 `middleware.ts` 파일을 생성하세요:

```typescript
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

## 🔒 보안 주의사항

1. **환경 변수 보호**
   - `.env.local` 파일은 절대 Git에 커밋하지 마세요
   - `.gitignore`에 `.env*`가 포함되어 있는지 확인하세요

2. **키 관리**
   - `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에 노출됩니다
   - `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용하고, 절대 클라이언트에 노출하면 안 됩니다

3. **RLS (Row Level Security)**
   - Supabase 테이블에서 RLS를 활성화하여 데이터 보안을 강화하세요
   - `createSupabaseAdminClient()`는 RLS를 우회하므로 신중하게 사용하세요

## 📚 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- 상세 사용법은 `lib/supabase/README.md` 참고

## ✅ 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] `.env.local` 파일 생성 및 환경 변수 설정
- [ ] 개발 서버 재시작 (`npm run dev`)
- [ ] 첫 번째 Supabase 쿼리 테스트
- [ ] 인증 기능 테스트 (선택사항)




