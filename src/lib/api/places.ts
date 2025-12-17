import { supabase, Database } from '../supabase'

export type Place = Database['public']['Tables']['places']['Row']
export type PlaceType = 'job' | 'housing' | 'amenity'

// 각 place의 실제 리뷰 통계 및 AI 한줄평 가져오기
async function getReviewStats(placeIds: string[]) {
  if (placeIds.length === 0) return {}
  
  const { data, error } = await supabase
    .from('reviews')
    .select('place_id, rating, content')
    .in('place_id', placeIds)
    .order('created_at', { ascending: false })
  
  if (error || !data) return {}
  
  // place_id별로 그룹화해서 평균, 개수, 한줄평 계산
  const stats: Record<string, { avgRating: number; reviewCount: number; shortReview: string }> = {}
  const grouped: Record<string, { ratings: number[]; contents: string[] }> = {}
  
  data.forEach(review => {
    if (!grouped[review.place_id]) {
      grouped[review.place_id] = { ratings: [], contents: [] }
    }
    grouped[review.place_id].ratings.push(review.rating)
    grouped[review.place_id].contents.push(review.content)
  })
  
  Object.entries(grouped).forEach(([placeId, { ratings, contents }]) => {
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    
    // AI 한줄평 생성: 최신 리뷰에서 핵심 문장 추출
    let shortReview = ''
    if (contents.length > 0) {
      // 가장 최신 리뷰의 장점 부분 추출
      const latestContent = contents[0]
      const prosMatch = latestContent.match(/\[장점\]\s*([^\[]+)/)
      if (prosMatch) {
        shortReview = prosMatch[1].trim().slice(0, 50)
        if (prosMatch[1].trim().length > 50) shortReview += '...'
      } else {
        shortReview = latestContent.slice(0, 50)
        if (latestContent.length > 50) shortReview += '...'
      }
    }
    
    stats[placeId] = {
      avgRating: Math.round(avg * 10) / 10,
      reviewCount: ratings.length,
      shortReview
    }
  })
  
  return stats
}

// Supabase에서 places 목록 가져오기 (AbortController로 타임아웃)
export async function getPlaces(options?: {
  type?: PlaceType
  category?: string
  location?: string
  country?: string
  limit?: number
}) {
  try {
    // 3초 타임아웃 설정
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    let query = supabase
      .from('places')
      .select('*', { signal: controller.signal } as any)
      .order('created_at', { ascending: false })

    // 국가별 필터링 (디버깅)
    console.log('getPlaces options:', options)
    if (options?.country) {
      console.log('Filtering by country:', options.country)
      query = query.eq('country', options.country)
    }
    if (options?.type) {
      query = query.eq('type', options.type)
    }
    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category)
    }
    if (options?.location && options.location !== '전체') {
      query = query.eq('location', options.location)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    clearTimeout(timeoutId)

    if (error) {
      console.error('Error fetching places:', error)
      return []
    }

    // 실제 리뷰 통계 가져오기
    const placeIds = (data as Place[]).map(p => p.id)
    const reviewStats = await getReviewStats(placeIds)
    
    // 리뷰 통계를 places에 병합 (한줄평 포함)
    const placesWithStats = (data as Place[]).map(place => ({
      ...place,
      avg_rating: reviewStats[place.id]?.avgRating ?? 0,
      review_count: reviewStats[place.id]?.reviewCount ?? 0,
      short_review: reviewStats[place.id]?.shortReview || null,
    }))

    return placesWithStats as Place[]
  } catch (error) {
    console.error('Supabase request failed or timed out:', error)
    return []
  }
}

// 단일 place 가져오기
export async function getPlaceById(id: string) {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching place:', error)
    return null
  }

  return data as Place
}

// Place를 홈 페이지 listing 형식으로 변환
export function placeToListing(place: Place) {
  return {
    id: place.id,
    category: place.category,
    title: place.name,
    subtitle: place.subtitle || '',
    location: place.location || '',
    rating: place.avg_rating,
    reviews: place.review_count,
    image: place.image_url || 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
    shortReview: place.short_review || '',
    tags: place.tags || [],
    workHours: place.work_hours || '',
    benefits: place.benefits || [],
    deposit: place.deposit || '',
    size: place.size || '',
  }
}

// Place를 지도 페이지용 형식으로 변환
export function placeToMapItem(place: Place) {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    category: place.category,
    rating: place.avg_rating,
    reviews: place.review_count,
    lat: place.lat,
    lng: place.lng,
    subtitle: place.subtitle || '',
    shortReview: place.short_review || '',
  }
}

// Supabase 연결 여부 확인
export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'
  )
}
