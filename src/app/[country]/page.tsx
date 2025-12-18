'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { WebLayout } from '@/components/layout/WebLayout'
import { usePlaces } from '@/hooks/usePlaces'
import { getCountryByCode, countries } from '@/lib/countries'
import { t, Language } from '@/lib/i18n'
import { 
  Search, SlidersHorizontal, Heart, Star, MapPin, ChevronDown,
  Briefcase, Home as HomeIcon, Store, Coffee, UtensilsCrossed,
  Hotel, Warehouse, Users, GraduationCap, Building2, Utensils,
  ShoppingBag, Fuel, Cross, Landmark, Filter, Loader2, Globe, Sparkles
} from 'lucide-react'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// 메인 카테고리 탭
const mainTabs = [
  { id: 'job', name: '일자리', nameEn: 'Jobs', icon: Briefcase, color: 'indigo' },
  { id: 'housing', name: '주거', nameEn: 'Housing', icon: HomeIcon, color: 'emerald' },
  { id: 'amenity', name: '편의시설', nameEn: 'Amenities', icon: Store, color: 'amber' },
]

// 일자리 서브 카테고리
const jobCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'cafe', name: '카페', nameEn: 'Cafe', icon: Coffee },
  { id: 'restaurant', name: '음식점', nameEn: 'Restaurant', icon: UtensilsCrossed },
  { id: 'hotel', name: '호텔', nameEn: 'Hotel', icon: Hotel },
  { id: 'office', name: '사무직', nameEn: 'Office', icon: Building2 },
  { id: 'factory', name: '공장', nameEn: 'Factory', icon: Warehouse },
  { id: 'academy', name: '학원', nameEn: 'Academy', icon: GraduationCap },
  { id: 'retail', name: '판매', nameEn: 'Retail', icon: ShoppingBag },
]

// 주거 서브 카테고리
const housingCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'oneroom', name: '원룸', nameEn: 'One-room', icon: HomeIcon },
  { id: 'sharehouse', name: '쉐어하우스', nameEn: 'Sharehouse', icon: Users },
  { id: 'officetel', name: '오피스텔', nameEn: 'Officetel', icon: Building2 },
  { id: 'goshiwon', name: '고시원', nameEn: 'Goshiwon', icon: Hotel },
]

// 편의시설 서브 카테고리
const amenityCategories = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'mart', name: '마트', nameEn: 'Mart', icon: ShoppingBag },
  { id: 'restaurant', name: '식당', nameEn: 'Restaurant', icon: Utensils },
  { id: 'hospital', name: '병원', nameEn: 'Hospital', icon: Cross },
  { id: 'bank', name: '은행', nameEn: 'Bank', icon: Landmark },
  { id: 'gas', name: '주유소', nameEn: 'Gas', icon: Fuel },
]

export default function CountryHomePage() {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.country as string
  
  const { language, setLanguage } = useStore()
  const [mainTab, setMainTab] = useState<'job' | 'housing' | 'amenity'>('job')
  const [subCategory, setSubCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('전체')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [favorites, setFavorites] = useState<(string | number)[]>([])

  // 국가 정보 가져오기
  const country = getCountryByCode(countryCode)
  
  // 유효하지 않은 국가 코드면 국가 선택 페이지로 리디렉트
  useEffect(() => {
    if (!country) {
      router.push('/country')
    } else {
      // 국가의 기본 언어 설정
      setLanguage(country.defaultLang as Language)
    }
  }, [country, router, setLanguage])

  // Supabase에서 데이터 가져오기 (국가별 필터링)
  const { listings: filteredListings, loading, isFromSupabase } = usePlaces({
    type: mainTab,
    category: subCategory,
    location: selectedLocation,
    country: countryCode,
  })

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const isKorean = language === 'ko'
  const currentTab = mainTabs.find(t => t.id === mainTab)!

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const getSubCategories = () => {
    switch (mainTab) {
      case 'job': return jobCategories
      case 'housing': return housingCategories
      case 'amenity': return amenityCategories
      default: return jobCategories
    }
  }

  const getTabName = (tab: typeof mainTabs[0]) => isKorean ? tab.name : tab.nameEn
  const getCatName = (cat: { name: string; nameEn: string }) => isKorean ? cat.name : cat.nameEn

  return (
    <WebLayout showNav={true}>
      {/* Country Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <h1 className="text-xl font-bold">
                  {isKorean ? country.name : country.nameEn}
                </h1>
                <p className="text-indigo-200 text-sm">
                  KNOWGL {isKorean ? country.name : country.nameEn}
                </p>
              </div>
            </div>
            <Link
              href="/country"
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-sm"
            >
              <Globe className="w-4 h-4" />
              {isKorean ? '국가 변경' : 'Change Country'}
            </Link>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center mb-6">
            <div className="max-w-full overflow-x-auto no-scrollbar">
              <div className="inline-flex bg-gray-100 rounded-full p-1 whitespace-nowrap">
                {mainTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = mainTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setMainTab(tab.id as any)
                        setSubCategory('all')
                      }}
                      className={cn(
                        'flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all',
                        isActive 
                          ? tab.color === 'indigo' ? 'bg-indigo-500 text-white shadow-md' 
                            : tab.color === 'emerald' ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-amber-500 text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {getTabName(tab)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition"
            >
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                {selectedLocation === '전체' ? (isKorean ? '전체 지역' : 'All Areas') : selectedLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
              {getSubCategories().map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSubCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                    subCategory === cat.id 
                      ? currentTab.color === 'indigo' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                        : currentTab.color === 'emerald' ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                        : 'bg-amber-50 border-amber-500 text-amber-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {getCatName(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {getTabName(currentTab)}
            <span className="text-gray-400 font-normal ml-2">{filteredListings.length}{isKorean ? '개' : ' items'}</span>
          </h2>
          <button 
            onClick={() => router.push(`/${countryCode}/map`)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-white rounded-lg transition',
              currentTab.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' 
                : currentTab.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-600 hover:bg-amber-700'
            )}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">{isKorean ? '지도로 보기' : 'View Map'}</span>
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer card-hover"
                onClick={() => router.push(`/place/${listing.id}`)}
              >
                <div className="relative aspect-[4/3]">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(listing.id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition"
                  >
                    <Heart className={cn(
                      'w-4 h-4 transition',
                      favorites.includes(listing.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                    )} />
                  </button>
                  <div className={cn(
                    'absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold',
                    mainTab === 'job' ? 'bg-indigo-500 text-white' 
                      : mainTab === 'housing' ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  )}>
                    {getTabName(currentTab)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{listing.subtitle}</p>
                  <p className={cn(
                    'text-sm mb-2 line-clamp-1',
                    listing.reviews > 0 && listing.shortReview ? 'text-gray-600' : 'text-gray-400 italic'
                  )}>
                    {listing.reviews > 0 && listing.shortReview 
                      ? `"${listing.shortReview}"` 
                      : (isKorean ? '리뷰가 없습니다' : 'No reviews yet')}
                  </p>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {listing.tags.slice(0, 2).map((tag: string, idx: number) => (
                      <span 
                        key={idx}
                        className={cn(
                          'px-2 py-1 text-xs rounded-md font-medium',
                          currentTab.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' 
                            : currentTab.color === 'emerald' ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-lg">
              {isKorean ? `해당 조건의 ${getTabName(currentTab)}이 없습니다` : `No ${getTabName(currentTab).toLowerCase()} found`}
            </p>
            <p className="text-gray-400 mt-1">
              {isKorean ? '다른 지역이나 카테고리를 선택해보세요' : 'Try different filters'}
            </p>
          </div>
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isKorean ? '지역 선택' : 'Select Area'}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSelectedLocation('전체')
                  setShowLocationModal(false)
                }}
                className={cn(
                  'py-3 rounded-xl text-sm font-medium transition',
                  selectedLocation === '전체'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {isKorean ? '전체' : 'All'}
              </button>
              {country.cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedLocation(city)
                    setShowLocationModal(false)
                  }}
                  className={cn(
                    'py-3 rounded-xl text-sm font-medium transition',
                    selectedLocation === city
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowLocationModal(false)}
              className="w-full mt-6 py-3 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition"
            >
              {isKorean ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </WebLayout>
  )
}
