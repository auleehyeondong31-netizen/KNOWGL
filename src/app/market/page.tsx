'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Loader2 } from 'lucide-react'

// 기존 /market 페이지는 국가별 마켓으로 리디렉트
export default function MarketPage() {
  const router = useRouter()
  const { onboardingData } = useStore()
  
  useEffect(() => {
    const country = onboardingData.destination || 'kr'
    router.replace(`/${country}/market`)
  }, [router, onboardingData.destination])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  )
}

