'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface PremiumStatus {
  isPremium: boolean
  premiumUntil: Date | null
  premiumPlan: 'monthly' | 'yearly' | null
  loading: boolean
}

export function usePremium(): PremiumStatus {
  const { user, isAuthenticated } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [premiumUntil, setPremiumUntil] = useState<Date | null>(null)
  const [premiumPlan, setPremiumPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPremiumStatus() {
      if (!isAuthenticated || !user) {
        setIsPremium(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium, premium_until, premium_plan')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching premium status:', error)
          setIsPremium(false)
        } else if (data) {
          // 프리미엄 만료 확인
          const now = new Date()
          const until = data.premium_until ? new Date(data.premium_until) : null
          
          if (data.is_premium && until && until > now) {
            setIsPremium(true)
            setPremiumUntil(until)
            setPremiumPlan(data.premium_plan)
          } else {
            setIsPremium(false)
            setPremiumUntil(null)
            setPremiumPlan(null)
          }
        }
      } catch (error) {
        console.error('Error:', error)
        setIsPremium(false)
      } finally {
        setLoading(false)
      }
    }

    fetchPremiumStatus()
  }, [user, isAuthenticated])

  return { isPremium, premiumUntil, premiumPlan, loading }
}

// 프리미엄 기능 사용 가능 여부 체크
export function canUseAITranslation(isPremium: boolean): boolean {
  return isPremium
}
