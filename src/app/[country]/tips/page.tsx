'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Lightbulb, Star, ChevronRight, BookOpen } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { CountryHeader, SearchInput, EmptyState } from '@/components/common'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { tipCategories, getTipsByCategory, getImportantTips, type Tip } from '@/lib/tipsData'

export default function CountryTipsPage() {
  const params = useParams()
  const countryCode = params.country as string
  const { language } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const isKorean = language === 'ko'
  const tips = getTipsByCategory(countryCode, selectedCategory)
  const importantTips = getImportantTips(countryCode)

  const filteredTips = tips.filter(tip => {
    if (!searchQuery) return true
    const title = isKorean ? tip.title : tip.titleEn
    const content = isKorean ? tip.content : tip.contentEn
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           content.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      amber: 'bg-amber-100 text-amber-600 border-amber-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      slate: 'bg-slate-100 text-slate-600 border-slate-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
    }
    return colors[color] || colors.indigo
  }

  const getCategoryBgColor = (color: string) => {
    const colors: Record<string, string> = {
      indigo: 'bg-indigo-500',
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      amber: 'bg-amber-500',
      purple: 'bg-purple-500',
      slate: 'bg-slate-500',
      orange: 'bg-orange-500',
    }
    return colors[color] || colors.indigo
  }

  return (
    <WebLayout>
      <CountryHeader
        countryCode={countryCode}
        title="생활 팁"
        titleEn="Living Tips"
        gradientFrom="from-teal-500"
        gradientTo="to-cyan-600"
        isKorean={isKorean}
      />

      {/* Important Tips Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="font-bold text-amber-800">
              {isKorean ? '꼭 알아야 할 필수 정보' : 'Must-Know Essential Info'}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {importantTips.slice(0, 5).map((tip) => (
              <div
                key={tip.id}
                onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                className="flex-shrink-0 bg-white rounded-lg px-4 py-3 shadow-sm border border-amber-200 cursor-pointer hover:shadow-md transition min-w-[250px] max-w-[300px]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {isKorean ? tip.title : tip.titleEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isKorean ? '팁 검색...' : 'Search tips...'}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border',
                selectedCategory === 'all'
                  ? 'bg-teal-50 border-teal-500 text-teal-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {isKorean ? '전체' : 'All'}
            </button>
            {tipCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition border flex items-center gap-2',
                  selectedCategory === cat.id
                    ? 'bg-teal-50 border-teal-500 text-teal-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <span>{cat.icon}</span>
                {isKorean ? cat.name : cat.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tips List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-900 text-lg">
                {selectedCategory === 'all' 
                  ? (isKorean ? '전체 팁' : 'All Tips')
                  : (isKorean 
                      ? tipCategories.find(c => c.id === selectedCategory)?.name 
                      : tipCategories.find(c => c.id === selectedCategory)?.nameEn)
                }
                <span className="text-gray-400 font-normal ml-2">
                  {filteredTips.length}{isKorean ? '개' : ' tips'}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {filteredTips.map((tip) => {
                const category = tipCategories.find(c => c.id === tip.category)
                const isExpanded = expandedTip === tip.id
                
                return (
                  <div
                    key={tip.id}
                    className={cn(
                      'bg-white rounded-xl border shadow-sm overflow-hidden transition-all cursor-pointer',
                      tip.important ? 'border-amber-200' : 'border-gray-100',
                      isExpanded ? 'shadow-md' : 'hover:shadow-md'
                    )}
                    onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
                          category ? getCategoryColor(category.color) : 'bg-gray-100'
                        )}>
                          {tip.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              category ? getCategoryColor(category.color) : 'bg-gray-100 text-gray-600'
                            )}>
                              {isKorean ? category?.name : category?.nameEn}
                            </span>
                            {tip.important && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-xs font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {isKorean ? '필수' : 'Essential'}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">
                            {isKorean ? tip.title : tip.titleEn}
                          </h3>
                          <p className={cn(
                            'text-gray-600 text-sm',
                            isExpanded ? '' : 'line-clamp-2'
                          )}>
                            {isKorean ? tip.content : tip.contentEn}
                          </p>
                        </div>
                        <ChevronRight className={cn(
                          'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
                          isExpanded && 'rotate-90'
                        )} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredTips.length === 0 && (
              <EmptyState
                icon={Lightbulb}
                title={isKorean ? '검색 결과가 없습니다' : 'No tips found'}
                subtitle={isKorean ? '다른 키워드로 검색해보세요' : 'Try different keywords'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Overview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-500" />
                {isKorean ? '카테고리별 팁' : 'Tips by Category'}
              </h3>
              <div className="space-y-2">
                {tipCategories.map((cat) => {
                  const count = getTipsByCategory(countryCode, cat.id).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-lg transition',
                        selectedCategory === cat.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'hover:bg-gray-50 text-gray-600'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-sm">
                          {isKorean ? cat.name : cat.nameEn}
                        </span>
                      </div>
                      <span className={cn(
                        'text-sm font-semibold px-2 py-0.5 rounded',
                        selectedCategory === cat.id
                          ? 'bg-teal-100 text-teal-600'
                          : 'bg-gray-100 text-gray-500'
                      )}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-gray-900">
                  {isKorean ? '팁 활용하기' : 'Using Tips'}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {isKorean 
                  ? '⭐ 표시된 팁은 해당 국가 생활에서 꼭 알아야 할 필수 정보입니다. 입국 전 반드시 확인하세요!'
                  : '⭐ marked tips are essential information for living in this country. Check before arrival!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}
