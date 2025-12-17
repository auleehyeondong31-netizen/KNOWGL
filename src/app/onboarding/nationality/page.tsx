'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, Globe, Search, Check, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { nations } from '@/lib/constants'
import { t } from '@/lib/i18n'

export default function NationalityPage() {
  const router = useRouter()
  const { language, onboardingData, setOnboardingData } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedNation = nations.find(n => n.code === onboardingData.nationality)

  const filteredNations = nations.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (code: string) => {
    setOnboardingData({ nationality: code })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => router.push('/login')} 
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
            <span className="text-sm font-medium text-gray-600">1/3 단계</span>
            <span className="text-sm text-gray-400">국적 선택</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: '33%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">국적을 선택해주세요</h1>
              <p className="text-gray-500">Where are you from?</p>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-4 px-5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {selectedNation ? selectedNation.code : '?'}
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${selectedNation ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {selectedNation ? selectedNation.name : '국적 선택'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition" />
            </button>

            <Button 
              onClick={() => router.push('/onboarding/language')}
              disabled={!selectedNation}
              className="w-full h-12 mt-6 bg-indigo-600 hover:bg-indigo-700"
            >
              다음 <ArrowRight className="w-4 h-4 ml-2" />
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
                  placeholder="국가명 검색 (예: Korea)" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {filteredNations.map((nation) => (
                  <li key={nation.code}>
                    <button 
                      onClick={() => handleSelect(nation.code)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                          {nation.code}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">{nation.name}</span>
                          <span className="text-xs text-gray-400">{nation.dial}</span>
                        </div>
                      </div>
                      {onboardingData.nationality === nation.code && (
                        <Check className="w-5 h-5 text-indigo-600" />
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
