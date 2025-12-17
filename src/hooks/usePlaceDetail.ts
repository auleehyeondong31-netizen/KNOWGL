'use client'

import { useState, useEffect } from 'react'
import { getPlaceById, isSupabaseConfigured, Place } from '@/lib/api/places'
import { getReviewsByPlaceId, Review } from '@/lib/api/reviews'

// Mock 데이터 (Supabase 미연결 시 사용)
const mockPlaceData = {
  id: '1',
  type: 'job' as const,
  name: '스타벅스 강남역점',
  category: 'cafe',
  subtitle: '바리스타 - 시급 12,000원',
  description: '강남역 1번 출구 도보 3분 거리에 위치한 스타벅스입니다. 외국인 직원 다수 근무 중이며, 한국어가 서툴러도 근무 가능합니다.',
  short_review: '직원 분위기 좋고 외국인 응대 매뉴얼이 잘 되어 있어요.',
  address: '서울 강남구 강남대로 396',
  location: '강남구',
  lat: 37.498,
  lng: 127.028,
  image_url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
  tags: ['외국인 환영', '한국어 초급 OK', '4대보험'],
  avg_rating: 4.8,
  review_count: 128,
  work_hours: '09:00 - 18:00',
  benefits: ['4대보험', '식사제공', '교통비 지원'],
  deposit: null,
  size: null,
  created_at: new Date().toISOString(),
}

const mockReviews = [
  {
    id: '1',
    place_id: '1',
    user_id: 'user1',
    rating: 5,
    rating_details: { salary: 4.2, balance: 3.8, atmosphere: 4.7, growth: 4.0, benefits: 4.5, foreigner: 4.9 },
    content: '정말 좋은 직장이에요! 한국어를 잘 못해도 동료들이 친절하게 알려줘요. 매니저님도 외국인 직원들을 잘 배려해주세요.',
    ai_summary: null,
    helpful_count: 45,
    author_name: 'John D.',
    author_country: 'USA',
    sentiment: 'positive',
    created_at: '2024-12-10T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '2',
    place_id: '1',
    user_id: 'user2',
    rating: 4,
    rating_details: {},
    content: '급여가 정확하게 나오고, 야근 수당도 잘 챙겨줍니다. 다만 주말에 손님이 너무 많아서 힘들어요.',
    ai_summary: null,
    helpful_count: 32,
    author_name: 'Nguyen T.',
    author_country: 'Vietnam',
    sentiment: 'positive',
    created_at: '2024-12-05T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
  },
  {
    id: '3',
    place_id: '1',
    user_id: 'user3',
    rating: 4,
    rating_details: {},
    content: '일본에서 왔는데, 여기서 일하면서 한국어가 많이 늘었어요. 손님들도 대체로 친절해요.',
    ai_summary: null,
    helpful_count: 28,
    author_name: 'Tanaka Y.',
    author_country: 'Japan',
    sentiment: 'positive',
    created_at: '2024-11-28T00:00:00Z',
    updated_at: '2024-11-28T00:00:00Z',
  },
  {
    id: '4',
    place_id: '1',
    user_id: 'user4',
    rating: 3,
    rating_details: {},
    content: '일은 괜찮은데 피크 시간에 너무 바빠요. 적응하는 데 시간이 좀 걸렸어요.',
    ai_summary: null,
    helpful_count: 15,
    author_name: 'Maria S.',
    author_country: 'Philippines',
    sentiment: 'neutral',
    created_at: '2024-11-20T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
]

export interface PlaceDetail {
  id: string
  type: 'job' | 'housing' | 'amenity'
  name: string
  category: string
  subtitle: string | null
  description: string | null
  shortReview: string | null
  address: string
  location: string | null
  lat: number
  lng: number
  imageUrl: string
  tags: string[]
  rating: number
  reviewCount: number
  workHours: string | null
  benefits: string[] | null
  deposit: string | null
  size: string | null
}

export interface ReviewItem {
  id: string
  rating: number
  ratingDetails: Record<string, number>
  content: string
  helpfulCount: number
  authorName: string
  authorCountry: string
  sentiment: string
  date: string
}

function placeToDetail(place: Place | typeof mockPlaceData): PlaceDetail {
  return {
    id: place.id,
    type: place.type as 'job' | 'housing' | 'amenity',
    name: place.name,
    category: place.category,
    subtitle: place.subtitle,
    description: place.description,
    shortReview: place.short_review,
    address: place.address,
    location: place.location,
    lat: place.lat,
    lng: place.lng,
    imageUrl: place.image_url || 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
    tags: place.tags || [],
    rating: place.avg_rating,
    reviewCount: place.review_count,
    workHours: place.work_hours,
    benefits: place.benefits,
    deposit: place.deposit,
    size: place.size,
  }
}

function reviewToItem(review: Review | typeof mockReviews[0]): ReviewItem {
  const date = new Date(review.created_at)
  return {
    id: review.id,
    rating: review.rating,
    ratingDetails: (review.rating_details as Record<string, number>) || {},
    content: review.content,
    helpfulCount: review.helpful_count || 0,
    authorName: review.author_name || 'Anonymous',
    authorCountry: review.author_country || 'Unknown',
    sentiment: review.sentiment || 'neutral',
    date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`,
  }
}

export function usePlaceDetail(placeId: string) {
  const [place, setPlace] = useState<PlaceDetail | null>(null)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFromSupabase, setIsFromSupabase] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      if (isSupabaseConfigured()) {
        try {
          const [placeData, reviewsData] = await Promise.all([
            getPlaceById(placeId),
            getReviewsByPlaceId(placeId),
          ])

          if (placeData) {
            setPlace(placeToDetail(placeData))
            setReviews(reviewsData.map(reviewToItem))
            setIsFromSupabase(true)
            setLoading(false)
            return
          }
        } catch (error) {
          console.warn('Supabase fetch failed, using mock data:', error)
        }
      }

      // Fallback to mock data
      setPlace(placeToDetail(mockPlaceData))
      setReviews(mockReviews.map(reviewToItem))
      setIsFromSupabase(false)
      setLoading(false)
    }

    fetchData()
  }, [placeId])

  return { place, reviews, loading, isFromSupabase }
}
