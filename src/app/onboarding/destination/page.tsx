'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, Plane, Search, Check, X, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { countries } from '@/lib/countries'
import { supabase } from '@/lib/supabase'

export default function DestinationPage() {
  const router = useRouter()
  const { language, onboardingData, setOnboardingData, setOnboarded } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCountry = countries.find(c => c.code === onboardingData.destination)

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (code: string) => {
    setOnboardingData({ destination: code })
    setShowModal(false)
  }

  const handleStart = async () => {
    if (!onboardingData.destination) return
    
    setLoading(true)
    
    try {
      // Supabase에 사용자 프로필 업데이트
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase.auth.updateUser({
          data: {
            nationality: onboardingData.nationality,
            language: onboardingData.language || language,
            destination: onboardingData.destination,
          }
        })
      }
      
      setOnboarded(true)
      // 선택한 국가 페이지로 바로 이동
      router.push(`/${onboardingData.destination}`)
    } catch (error) {
      console.error('Failed to save profile:', error)
      setOnboarded(true)
      router.push(`/${onboardingData.destination}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => router.push('/onboarding/language')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>뒤로</span>
            </button>
            <Link href="/" className="text-2xl font-black text-indigo-600">KNOWGL</Link>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">3/3 단계</span>
            <span className="text-sm text-gray-400">목적지 선택</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-amber-600 mb-4">
                <Plane className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">목적지를 선택해주세요</h1>
              <p className="text-gray-500">목적지에 맞는 꿀팁과 정보를 보여드릴게요</p>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-4 px-5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between hover:border-amber-500 hover:bg-amber-50 transition group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedCountry?.flag || '🌍'}</span>
                <div className="text-left">
                  <div className={`font-semibold ${selectedCountry ? 'text-amber-600' : 'text-gray-600'}`}>
                    {selectedCountry ? selectedCountry.name : '목적지 선택'}
                  </div>
                  {selectedCountry && (
                    <div className="text-sm text-gray-500">{selectedCountry.nameEn}</div>
                  )}
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition" />
            </button>

            <Button 
              onClick={handleStart}
              disabled={!onboardingData.destination || loading}
              className="w-full h-12 mt-6 bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  시작하기
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 flex items-center">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="목적지 검색 (예: Korea)" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {filteredCountries.map((country) => (
                  <li key={country.code}>
                    <button 
                      onClick={() => handleSelect(country.code)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <span className="font-medium text-gray-900 block">{country.name}</span>
                          <span className="text-xs text-gray-400">{country.nameEn}</span>
                        </div>
                      </div>
                      {onboardingData.destination === country.code && (
                        <Check className="w-5 h-5 text-amber-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
