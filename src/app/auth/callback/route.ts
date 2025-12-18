import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Supabase 설정
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://klqvgmdzqvluplmjjbey.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscXZnbWR6cXZsdXBsbWpqYmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTUzMjEsImV4cCI6MjA4MTQ5MTMyMX0.ZKMHNeLOtWOlKMxOzh4fbme2Yc-DAq6yuklDPt4MDrw'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore,
    }, {
      supabaseUrl: SUPABASE_URL,
      supabaseKey: SUPABASE_ANON_KEY,
    })
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // 신규 사용자인지 확인 (created_at과 last_sign_in_at이 비슷하면 신규)
    if (data.user) {
      const createdAt = new Date(data.user.created_at).getTime()
      const lastSignIn = new Date(data.user.last_sign_in_at || data.user.created_at).getTime()
      const isNewUser = Math.abs(lastSignIn - createdAt) < 60000 // 1분 이내면 신규 사용자
      
      if (isNewUser) {
        return NextResponse.redirect(new URL('/onboarding/nationality', requestUrl.origin))
      }
    }
  }

  // 기존 사용자는 홈으로 리디렉트
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
