'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Search, ChevronRight } from 'lucide-react'
import { countries } from '@/lib/countries'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function CountrySelectPage() {
  const router = useRouter()
  const { language, setOnboardingData } = useStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCountry = (countryCode: string) => {
    // 온보딩 데이터에 목적지 저장
    setOnboardingData({ destination: countryCode })
    // 해당 국가 페이지로 이동
    router.push(`/${countryCode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">KNOWGL</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            어디로 떠나시나요?
          </h2>
          <p className="text-gray-500">
            목적지 국가를 선택해주세요
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="국가 검색..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          />
        </div>

        {/* Country List */}
        <div className="space-y-3">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelectCountry(country.code)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group"
            >
              <span className="text-4xl">{country.flag}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                  {country.name}
                </div>
                <div className="text-sm text-gray-500">{country.nameEn}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition" />
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">검색 결과가 없습니다</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            더 많은 국가가 곧 추가됩니다!
          </p>
        </div>
      </main>
    </div>
  )
}
