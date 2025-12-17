'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Star, ShoppingBag, Eye, Heart, Plus } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { CountryHeader, SearchInput, CategoryPills, EmptyState } from '@/components/common'
import { useStore } from '@/store/useStore'
import { marketCategories } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { marketItemsByCountry, getCurrencySymbol } from '@/lib/mockData'

export default function CountryMarketPage() {
  const params = useParams()
  const countryCode = params.country as string
  const { language } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const isKorean = language === 'ko'
  const mockItems = marketItemsByCountry[countryCode] || marketItemsByCountry['kr']
  const currency = getCurrencySymbol(countryCode)

  const filteredItems = mockItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <WebLayout>
      <CountryHeader
        countryCode={countryCode}
        title="지식 마켓"
        titleEn="Knowledge Market"
        gradientFrom="from-amber-500"
        gradientTo="to-orange-600"
        isKorean={isKorean}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-500 mt-1">
                {isKorean ? '유용한 정보와 가이드를 찾아보세요' : 'Find useful information and guides'}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold">
              <Plus className="w-4 h-4" />
              {isKorean ? '지식 판매하기' : 'Sell Knowledge'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isKorean ? '지식 검색...' : 'Search...'}
            />
            <CategoryPills
              categories={marketCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              activeColor="amber"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-900">
            {selectedCategory === 'all' ? (isKorean ? '전체' : 'All') : marketCategories.find(c => c.id === selectedCategory)?.name}
            <span className="text-gray-400 font-normal ml-2">{filteredItems.length}{isKorean ? '개' : ' items'}</span>
          </h2>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer group"
            >
              <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {item.thumbnail}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[48px]">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-gray-400 text-sm">({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'font-bold text-lg',
                    item.price === 0 ? 'text-emerald-600' : 'text-amber-600'
                  )}>
                    {item.price === 0 ? (isKorean ? '무료' : 'Free') : `${currency}${item.price.toLocaleString()}`}
                  </span>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" /> {item.views}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" /> {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title={isKorean ? '검색 결과가 없습니다' : 'No results found'}
          />
        )}
      </div>
    </WebLayout>
  )
}
