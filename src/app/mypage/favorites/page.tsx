'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Heart, MapPin, Star, Briefcase, Home, 
  Trash2, Filter, Search
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface FavoritePlace {
  id: string
  name: string
  type: 'job' | 'housing' | 'restaurant' | 'service'
  location: string
  rating: number
  reviewCount: number
  image: string
  savedAt: Date
}

const mockFavorites: FavoritePlace[] = [
  {
    id: '1',
    name: '스타벅스 강남역점',
    type: 'job',
    location: '서울 강남구',
    rating: 4.5,
    reviewCount: 128,
    image: '☕',
    savedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '원룸 월세 50/45',
    type: 'housing',
    location: '서울 신촌',
    rating: 4.2,
    reviewCount: 45,
    image: '🏠',
    savedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: '맛있는 라멘집',
    type: 'restaurant',
    location: '서울 홍대',
    rating: 4.8,
    reviewCount: 230,
    image: '🍜',
    savedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: '외국인 전용 병원',
    type: 'service',
    location: '서울 이태원',
    rating: 4.6,
    reviewCount: 89,
    image: '🏥',
    savedAt: new Date('2024-01-01'),
  },
]

const typeLabels: Record<string, { ko: string; en: string; color: string }> = {
  job: { ko: '일자리', en: 'Job', color: 'bg-blue-100 text-blue-700' },
  housing: { ko: '숙소', en: 'Housing', color: 'bg-green-100 text-green-700' },
  restaurant: { ko: '맛집', en: 'Restaurant', color: 'bg-orange-100 text-orange-700' },
  service: { ko: '서비스', en: 'Service', color: 'bg-purple-100 text-purple-700' },
}

export default function FavoritesPage() {
  const router = useRouter()
  const { language } = useStore()
  const { showToast } = useToast()
  
  const isKorean = language === 'ko'
  const [favorites, setFavorites] = useState<FavoritePlace[]>(mockFavorites)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFavorites = favorites.filter(fav => {
    if (filterType !== 'all' && fav.type !== filterType) return false
    if (searchQuery && !fav.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
    showToast(isKorean ? '찜 목록에서 삭제되었습니다' : 'Removed from favorites', 'success')
  }

  return (
    <WebLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isKorean ? '찜한 장소' : 'Saved Places'}
              </h1>
              <p className="text-sm text-gray-500">
                {filteredFavorites.length}{isKorean ? '개의 장소' : ' places'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKorean ? '장소 검색...' : 'Search places...'}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['all', 'job', 'housing', 'restaurant', 'service'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition',
                  filterType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {type === 'all' 
                  ? (isKorean ? '전체' : 'All') 
                  : (isKorean ? typeLabels[type].ko : typeLabels[type].en)}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length > 0 ? (
          <div className="space-y-3">
            {filteredFavorites.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {place.image}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={cn(
                          'inline-block px-2 py-0.5 rounded text-xs font-medium mb-1',
                          typeLabels[place.type].color
                        )}>
                          {isKorean ? typeLabels[place.type].ko : typeLabels[place.type].en}
                        </span>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {place.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFavorite(place.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      {place.location}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-900">{place.rating}</span>
                        <span className="text-gray-400">({place.reviewCount})</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-400">
                        {isKorean ? '저장일: ' : 'Saved: '}
                        {place.savedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {isKorean ? '찜한 장소가 없습니다' : 'No saved places'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isKorean 
                ? '마음에 드는 장소를 찜해보세요!'
                : 'Save places you like!'}
            </p>
            <Link
              href="/kr"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              {isKorean ? '장소 둘러보기' : 'Browse Places'}
            </Link>
          </div>
        )}
      </div>
    </WebLayout>
  )
}
