'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Globe } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const languages = [
  { code: 'ko', name: '한국어', nameEn: 'Korean', flag: '🇰🇷' },
  { code: 'en', name: 'English', nameEn: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', nameEn: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: '中文', nameEn: 'Chinese', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', nameEn: 'Vietnamese', flag: '🇻🇳' },
]

export default function LanguageSettingsPage() {
  const router = useRouter()
  const { language, setLanguage } = useStore()
  const { showToast } = useToast()
  
  const isKorean = language === 'ko'

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
    showToast(
      langCode === 'ko' ? '언어가 변경되었습니다' : 'Language changed',
      'success'
    )
  }

  return (
    <WebLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {isKorean ? '언어 설정' : 'Language Settings'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              {isKorean ? '앱 언어 선택' : 'Select App Language'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isKorean 
                ? '선택한 언어로 앱이 표시됩니다'
                : 'The app will be displayed in the selected language'}
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  'w-full flex items-center justify-between p-5 hover:bg-gray-50 transition',
                  language === lang.code && 'bg-indigo-50'
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{lang.name}</p>
                    <p className="text-sm text-gray-500">{lang.nameEn}</p>
                  </div>
                </div>
                {language === lang.code && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-5 border border-blue-200">
          <p className="text-sm text-blue-700">
            {isKorean 
              ? '💡 일부 콘텐츠는 원본 언어로 표시될 수 있습니다.'
              : '💡 Some content may be displayed in its original language.'}
          </p>
        </div>
      </div>
    </WebLayout>
  )
}
