import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Supabase 서버 클라이언트 생성 (서버 컴포넌트에서 사용)
// Next.js 서버 컴포넌트나 API 라우트에서 사용할 때 이 함수를 사용합니다
export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 환경 변수가 없으면 에러 발생
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    );
  }

  // Next.js 16에서는 cookies()가 비동기 함수입니다
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // 쿠키 읽기
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // 쿠키 설정
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch (error) {
          // 서버 컴포넌트에서는 쿠키를 직접 설정할 수 없을 수 있습니다
          // 이 경우 클라이언트 컴포넌트에서 처리해야 합니다
        }
      },
      // 쿠키 삭제
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch (error) {
          // 서버 컴포넌트에서는 쿠키를 직접 삭제할 수 없을 수 있습니다
        }
      },
    },
  });
}

// Service Role Key를 사용하는 관리자 클라이언트 (서버 사이드 전용)
// 주의: 이 클라이언트는 RLS(Row Level Security)를 우회하므로 신중하게 사용해야 합니다
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase 관리자 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
