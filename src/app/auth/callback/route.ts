import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
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
