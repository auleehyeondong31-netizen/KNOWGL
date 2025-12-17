'use client'

import { useState } from 'react'
import { Languages, Loader2, Check, X, Crown, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { usePremium } from '@/hooks/usePremium'
import Link from 'next/link'

interface TranslateButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md'
  onTranslated?: (translatedText: string) => void
}

// AI 번역 API 호출 (재시도 로직 포함)
async function translateWithAI(text: string, targetLang: string, retries = 2): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초 타임아웃
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        return data.translatedText
      }
    } catch (error) {
      if (i === retries) return null
      await new Promise(r => setTimeout(r, 500)) // 재시도 전 대기
    }
  }
  return null
}

// 무료 번역 API (서버를 통해 호출) - 일반 사용자용
async function translateFree(text: string, targetLang: string): Promise<string | null> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang, useFree: true }),
      signal: AbortSignal.timeout(15000),
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.translatedText || null
    }
    return null
  } catch {
    return null
  }
}

// Google Translate를 통한 번역 (새 탭에서 열기) - 폴백용
export function translateWithGoogle(text: string, targetLang: string = 'ko') {
  const url = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate`
  window.open(url, '_blank')
}

// 텍스트 번역 버튼 컴포넌트
export function TranslateButton({ text, className, size = 'sm', onTranslated }: TranslateButtonProps) {
  const { language } = useStore()
  const [isTranslating, setIsTranslating] = useState(false)
  const [translated, setTranslated] = useState<string | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)

  const isKorean = language === 'ko'
  const targetLang = language === 'ko' ? 'ko' : language === 'ja' ? 'ja' : 'en'

  const handleTranslate = async () => {
    if (translated) {
      setShowTranslation(!showTranslation)
      return
    }

    setIsTranslating(true)
    
    const result = await translateWithAI(text, targetLang)
    
    if (result) {
      setTranslated(result)
      setShowTranslation(true)
      onTranslated?.(result)
    } else {
      // AI 번역 실패 시 알림
      setTranslated('번역에 실패했습니다. 다시 시도해주세요.')
      setShowTranslation(true)
    }
    
    setIsTranslating(false)
  }

  const buttonSize = size === 'sm' 
    ? 'px-2 py-1 text-xs gap-1' 
    : 'px-3 py-1.5 text-sm gap-1.5'

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className={cn(
          'inline-flex items-center rounded-md font-medium transition',
          'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSize
        )}
      >
        {isTranslating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Languages className="w-3 h-3" />
        )}
        {showTranslation 
          ? (isKorean ? '원문 보기' : 'Original')
          : (isKorean ? '번역' : 'Translate')}
      </button>
      
      {showTranslation && translated && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-gray-700">
          <div className="flex items-start justify-between gap-2">
            <p>{translated}</p>
            <button
              onClick={() => setShowTranslation(false)}
              className="flex-shrink-0 p-1 hover:bg-blue-100 rounded"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// 전체 페이지 번역 버튼 (헤더용)
interface PageTranslateButtonProps {
  className?: string
}

export function PageTranslateButton({ className }: PageTranslateButtonProps) {
  const { language } = useStore()
  const [showMenu, setShowMenu] = useState(false)
  
  const isKorean = language === 'ko'
  
  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ]

  const translatePage = (targetLang: string) => {
    // Google Translate를 사용하여 페이지 전체 번역
    const currentUrl = window.location.href
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`
    window.open(translateUrl, '_blank')
    setShowMenu(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isKorean ? '페이지 번역' : 'Translate'}
        </span>
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
              {isKorean ? '번역 언어 선택' : 'Translate to'}
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => translatePage(lang.code)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// 간단한 번역 링크 버튼 (Google Translate로 바로 이동)
interface QuickTranslateProps {
  text: string
  className?: string
}

export function QuickTranslate({ text, className }: QuickTranslateProps) {
  const { language } = useStore()
  const { isPremium, loading: premiumLoading } = usePremium()
  const [isTranslating, setIsTranslating] = useState(false)
  const [translated, setTranslated] = useState<string | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [translationType, setTranslationType] = useState<'ai' | 'free'>('free')
  
  const isKorean = language === 'ko'
  const targetLang = language === 'ko' ? 'ko' : language === 'ja' ? 'ja' : 'en'

  const handleTranslate = async () => {
    if (translated) {
      setShowTranslation(!showTranslation)
      return
    }

    setIsTranslating(true)
    
    let result: string | null = null
    
    if (isPremium) {
      // 프리미엄: AI 번역
      result = await translateWithAI(text, targetLang)
      setTranslationType('ai')
    } else {
      // 일반: 무료 번역 API
      result = await translateFree(text, targetLang)
      setTranslationType('free')
    }
    
    if (result) {
      setTranslated(result)
      setShowTranslation(true)
    } else {
      setTranslated(isKorean ? '번역에 실패했습니다.' : 'Translation failed.')
      setShowTranslation(true)
    }
    
    setIsTranslating(false)
  }

  return (
    <div className={cn('inline-flex flex-col', className)}>
      <button
        onClick={handleTranslate}
        disabled={isTranslating || premiumLoading}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition',
          isPremium 
            ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
          'disabled:opacity-50'
        )}
      >
        {isTranslating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isPremium ? (
          <Crown className="w-3 h-3" />
        ) : (
          <Languages className="w-3 h-3" />
        )}
        {showTranslation 
          ? (isKorean ? '원문' : 'Original') 
          : isPremium 
            ? (isKorean ? 'AI번역' : 'AI Translate')
            : (isKorean ? '번역' : 'Translate')}
      </button>
      
      {/* 번역 결과 */}
      {showTranslation && translated && (
        <div className={cn(
          "mt-2 p-3 rounded-lg border text-sm text-gray-700",
          translationType === 'ai' 
            ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        )}>
          <div className="flex items-start gap-2">
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1",
              translationType === 'ai'
                ? "bg-amber-100 text-amber-600"
                : "bg-blue-100 text-blue-600"
            )}>
              {translationType === 'ai' ? (
                <><Crown className="w-2.5 h-2.5" /> AI</>
              ) : (
                '번역'
              )}
            </span>
            <p className="flex-1">{translated}</p>
            <button
              onClick={() => setShowTranslation(false)}
              className={cn(
                "flex-shrink-0 p-1 rounded",
                translationType === 'ai' ? "hover:bg-amber-100" : "hover:bg-blue-100"
              )}
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
