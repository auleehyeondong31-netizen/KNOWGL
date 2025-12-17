'use client'

import { useState, useEffect } from 'react'
import { getPlaces, placeToMapItem, isSupabaseConfigured, PlaceType } from '@/lib/api/places'

// Mock 데이터 (Supabase 미연결 시 사용)
const mockMapPlaces = [
  { id: 1, name: '스타벅스 강남점', type: 'job' as const, category: 'cafe', rating: 4.2, reviews: 128, lat: 37.498, lng: 127.028, subtitle: '바리스타 - 시급 12,000원', shortReview: '초보도 적응 쉬워요. 근무 환경 깔끔한 편.' },
  { id: 2, name: '신라호텔', type: 'job' as const, category: 'hotel', rating: 4.5, reviews: 89, lat: 37.556, lng: 127.005, subtitle: '프론트 - 월급 280만원', shortReview: '체계적이지만 응대 강도는 높아요.' },
  { id: 3, name: '강남 고시원', type: 'housing' as const, category: 'goshiwon', rating: 3.8, reviews: 45, lat: 37.501, lng: 127.025, subtitle: '고시원 - 월 35만원', shortReview: '가성비 무난. 공용시설은 피크시간 붐빔.' },
  { id: 4, name: '홍대 쉐어하우스', type: 'housing' as const, category: 'sharehouse', rating: 4.1, reviews: 67, lat: 37.556, lng: 126.923, subtitle: '1인실 - 월 45만원', shortReview: '공용공간 깨끗하고 커뮤니티 분위기 좋아요.' },
  { id: 201, name: '이마트 강남점', type: 'amenity' as const, category: 'mart', rating: 4.5, reviews: 320, lat: 37.495, lng: 127.030, subtitle: '대형마트 - 24시간', shortReview: '새벽 운영이 장점. 주말엔 주차 대기 있어요.' },
  { id: 202, name: '세브란스 병원', type: 'amenity' as const, category: 'hospital', rating: 4.8, reviews: 567, lat: 37.560, lng: 126.940, subtitle: '종합병원 - 외국어 가능', shortReview: '진료 만족도 높지만 대기시간은 길 수 있어요.' },
  { id: 203, name: '하나은행 홍대점', type: 'amenity' as const, category: 'bank', rating: 4.3, reviews: 89, lat: 37.555, lng: 126.925, subtitle: '은행 - 외국인 계좌 개설', shortReview: '외국인 안내 친절. 점심시간 혼잡.' },
  { id: 204, name: 'GS칼텍스 강남', type: 'amenity' as const, category: 'gas', rating: 4.1, reviews: 45, lat: 37.500, lng: 127.035, subtitle: '주유소 - 24시간', shortReview: '야간에도 이용 가능해서 편해요.' },
]

export interface MapPlace {
  id: string | number
  name: string
  type: PlaceType
  category: string
  rating: number
  reviews: number
  lat: number
  lng: number
  subtitle: string
  shortReview: string
}

interface UseMapPlacesOptions {
  type: PlaceType
  category?: string
}

export function useMapPlaces({ type, category }: UseMapPlacesOptions) {
  const [places, setPlaces] = useState<MapPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [isFromSupabase, setIsFromSupabase] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Supabase가 설정되어 있으면 DB에서 가져오기
      if (isSupabaseConfigured()) {
        try {
          const data = await getPlaces({ type, category })
          if (data.length > 0) {
            setPlaces(data.map(placeToMapItem))
            setIsFromSupabase(true)
            setLoading(false)
            return
          }
        } catch (error) {
          console.warn('Supabase fetch failed, using mock data:', error)
        }
      }

      // Supabase 미설정 또는 실패 시 mock 데이터 사용
      let mockData = mockMapPlaces.filter(p => p.type === type)
      
      if (category && category !== 'all') {
        mockData = mockData.filter(p => p.category === category)
      }

      setPlaces(mockData)
      setIsFromSupabase(false)
      setLoading(false)
    }

    fetchData()
  }, [type, category])

  return { places, loading, isFromSupabase }
}
