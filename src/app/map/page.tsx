'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Filter, MapPin, Star, Briefcase, Home as HomeIcon, 
  X, List, ArrowLeft, Store, ShoppingBag, Cross, Landmark, Fuel, Loader2
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { t } from '@/lib/i18n'
import { jobCategories, housingCategories } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useMapPlaces, MapPlace } from '@/hooks/useMapPlaces'

// 편의시설 카테고리
const amenityCategories = [
  { id: 'all', name: '전체' },
  { id: 'mart', name: '마트' },
  { id: 'hospital', name: '병원' },
  { id: 'bank', name: '은행' },
  { id: 'gas', name: '주유소' },
]

export default function MapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, mapMode, setMapMode } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)
  const [showList, setShowList] = useState(false)

  // Supabase 연동 훅 (미설정 시 mock 데이터 자동 사용)
  const { places: filteredPlaces, loading, isFromSupabase } = useMapPlaces({
    type: mapMode,
    category: selectedCategory,
  })

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'job' || mode === 'housing' || mode === 'amenity') {
      setMapMode(mode)
    }
  }, [searchParams, setMapMode])

  const categories = mapMode === 'job' ? jobCategories : mapMode === 'housing' ? housingCategories : amenityCategories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/" className="text-xl font-black text-indigo-600">KNOWGL</Link>
            </div>
            
            {/* Mode Toggle */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => { setMapMode('job'); setSelectedCategory('all'); }}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition',
                  mapMode === 'job'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Briefcase className="w-4 h-4" />
                일자리
              </button>
              <button
                onClick={() => { setMapMode('housing'); setSelectedCategory('all'); }}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition',
                  mapMode === 'housing'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <HomeIcon className="w-4 h-4" />
                주거
              </button>
              <button
                onClick={() => { setMapMode('amenity'); setSelectedCategory('all'); }}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition',
                  mapMode === 'amenity'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Store className="w-4 h-4" />
                편의시설
              </button>
            </div>

            <button 
              onClick={() => setShowList(!showList)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{showList ? '지도' : '목록'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            {/* Mobile Mode Toggle */}
            <div className="flex sm:hidden gap-2 mb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => { setMapMode('job'); setSelectedCategory('all'); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition whitespace-nowrap',
                  mapMode === 'job'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                <Briefcase className="w-3.5 h-3.5" />
                일자리
              </button>
              <button
                onClick={() => { setMapMode('housing'); setSelectedCategory('all'); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition whitespace-nowrap',
                  mapMode === 'housing'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                <HomeIcon className="w-3.5 h-3.5" />
                주거
              </button>
              <button
                onClick={() => { setMapMode('amenity'); setSelectedCategory('all'); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition whitespace-nowrap',
                  mapMode === 'amenity'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                <Store className="w-3.5 h-3.5" />
                편의시설
              </button>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-0 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border',
                      selectedCategory === cat.id
                        ? mapMode === 'job' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                          : mapMode === 'housing'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-amber-50 border-amber-500 text-amber-600'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">필터</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex relative" style={{ height: 'calc(100vh - 130px)' }}>
        {/* Map Area */}
        <div className={cn(
          'relative bg-gray-200 transition-all w-full',
          showList ? 'md:w-1/2' : 'w-full'
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-3" />
              <p className="font-medium">Google Maps 연동 예정</p>
              <p className="text-sm">API 키 설정 후 지도가 표시됩니다</p>
            </div>
          </div>
          
          {/* Mock Pins */}
          {filteredPlaces.map((place, idx) => (
            <button
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className={cn(
                'absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition hover:scale-110',
                mapMode === 'job' ? 'bg-indigo-600' : mapMode === 'housing' ? 'bg-emerald-600' : 'bg-amber-600',
                selectedPlace?.id === place.id && 'ring-4 ring-white scale-110'
              )}
              style={{
                top: `${25 + idx * 18}%`,
                left: `${15 + idx * 22}%`,
              }}
            >
              {place.rating.toFixed(1)}
            </button>
          ))}

          {/* Selected Place Card */}
          {selectedPlace && !showList && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-xl p-5 z-20">
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0',
                  mapMode === 'job' ? 'bg-indigo-100 text-indigo-600' : mapMode === 'housing' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                )}>
                  {mapMode === 'job' ? <Briefcase className="w-8 h-8" /> : mapMode === 'housing' ? <HomeIcon className="w-8 h-8" /> : <Store className="w-8 h-8" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{selectedPlace.subtitle}</p>
                  <p
                    className={cn(
                      'text-sm mb-2 line-clamp-1',
                      'shortReview' in selectedPlace && selectedPlace.shortReview ? 'text-gray-600' : 'text-gray-400 italic'
                    )}
                  >
                    “{'shortReview' in selectedPlace && selectedPlace.shortReview ? selectedPlace.shortReview : '한줄평 없음'}”
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{selectedPlace.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({selectedPlace.reviews}개 리뷰)</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/place/${selectedPlace.id}`)}
                className={cn(
                  'w-full mt-4 py-3 rounded-xl text-white font-semibold transition',
                  mapMode === 'job' ? 'bg-indigo-600 hover:bg-indigo-700' : mapMode === 'housing' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                )}
              >
                상세보기
              </button>
            </div>
          )}
        </div>

        {/* List Panel */}
        {showList && (
          <div className="absolute inset-0 md:relative md:inset-auto md:w-1/2 bg-white border-l border-gray-200 overflow-y-auto z-30">
            <div className="p-4">
              <h2 className="font-bold text-gray-900 mb-4">
                {mapMode === 'job' ? '일자리' : mapMode === 'housing' ? '주거' : '편의시설'} 목록
                <span className="text-gray-400 font-normal ml-2">{filteredPlaces.length}개</span>
                {isFromSupabase && (
                  <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full font-medium">DB</span>
                )}
              </h2>
              <div className="space-y-3">
                {filteredPlaces.map((place) => (
                  <div 
                    key={place.id}
                    onClick={() => {
                      setSelectedPlace(place)
                      router.push(`/place/${place.id}`)
                    }}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition',
                      selectedPlace?.id === place.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                        mapMode === 'job' ? 'bg-indigo-100 text-indigo-600' : mapMode === 'housing' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      )}>
                        {mapMode === 'job' ? <Briefcase className="w-6 h-6" /> : mapMode === 'housing' ? <HomeIcon className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{place.name}</h3>
                        <p className="text-sm text-gray-500">{place.subtitle}</p>
                        <p
                          className={cn(
                            'text-sm line-clamp-1 mt-1',
                            'shortReview' in place && place.shortReview ? 'text-gray-600' : 'text-gray-400 italic'
                          )}
                        >
                          “{'shortReview' in place && place.shortReview ? place.shortReview : '한줄평 없음'}”
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-sm">{place.rating}</span>
                          <span className="text-gray-400 text-sm">({place.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
