'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/auth'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: false, // 초기값을 false로 변경하여 로딩 지연 방지
    isAuthenticated: false,
  })

  // supabase 클라이언트를 useMemo로 캐싱
  const supabase = useMemo(() => createClient(), [])

  // 초기 세션 로드 및 auth 상태 변경 구독
  useEffect(() => {
    let mounted = true

    // 현재 세션 가져오기
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAuthenticated: !!session?.user,
          })
        }
      } catch (error) {
        console.error('Error getting session:', error)
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }))
        }
      }
    }

    getInitialSession()

    // Auth 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAuthenticated: !!session?.user,
          })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  // 로그아웃
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [])

  return {
    ...state,
    logout,
  }
}
