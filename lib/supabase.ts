import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let supabaseAdminClient: SupabaseClient | null = null;

if (supabaseServiceRoleKey) {
  // 서버에서만 사용하는 Service Role 클라이언트 (쓰기 작업 전용)
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
}

export const supabaseAdmin = supabaseAdminClient;

export const ensureSupabaseAdmin = (): SupabaseClient => {
  if (!supabaseAdminClient) {
    // 필수 환경 변수가 없으면 CRUD API가 안전하게 실패하도록 처리
    throw new Error('Supabase service role key is not set');
  }

  return supabaseAdminClient;
};
