'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Loader2 } from 'lucide-react'

// 기본 홈페이지는 온보딩에서 선택한 국가 또는 국가 선택 페이지로 리디렉트
export default function HomePage() {
  const router = useRouter()
  const { onboardingData } = useStore()
  
  useEffect(() => {
    // 온보딩에서 선택한 목적지가 있으면 해당 국가로, 아니면 국가 선택 페이지로
    if (onboardingData.destination) {
      router.replace(`/${onboardingData.destination}`)
    } else {
      router.replace('/country')
    }
  }, [router, onboardingData.destination])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  )
}
