import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './supabase'

// 클라이언트 컴포넌트용 Supabase 클라이언트
export const createClient = () => createClientComponentClient<Database>()

// 이메일 로그인
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// 이메일 회원가입 (이메일 인증 포함)
export async function signUpWithEmail(email: string, password: string, metadata?: {
  name?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  })
  return { data, error }
}

// 로그아웃
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 현재 사용자 가져오기
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// 세션 가져오기
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// 비밀번호 재설정 이메일 발송
export async function resetPassword(email: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { data, error }
}

// OAuth 로그인 (Google, Kakao, Apple 등)
export async function signInWithOAuth(provider: 'google' | 'kakao' | 'github' | 'apple') {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// 전화번호로 OTP 발송
export async function signInWithPhone(phone: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  })
  return { data, error }
}

// 전화번호 OTP 인증
export async function verifyPhoneOtp(phone: string, token: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  return { data, error }
}
