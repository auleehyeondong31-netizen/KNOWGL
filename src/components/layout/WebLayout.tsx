'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, MapPin, ShoppingBag, Users, User, Search, Bell, Globe, LogIn, LogOut, Loader2, ChevronDown, Lightbulb, Languages
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import { Language } from '@/lib/i18n'
import { PageTranslateButton } from '@/components/common/TranslateButton'

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
]

interface WebLayoutProps {
  children: ReactNode
  showNav?: boolean
}

export function WebLayout({ children, showNav = true }: WebLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, onboardingData } = useStore()
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth()
  const [showLangMenu, setShowLangMenu] = useState(false)
  
  const currentLang = languages.find(l => l.code === language) || languages[0]
  
  // URL에서 국가 코드 추출 또는 온보딩 데이터에서 가져오기
  const countryFromPath = pathname.split('/')[1]
  const validCountries = ['kr', 'jp', 'au', 'us', 'ca', 'sg', 'tw']
  const currentCountry = validCountries.includes(countryFromPath) ? countryFromPath : (onboardingData.destination || 'kr')
  
  // 동적 네비게이션 아이템
  const navItems = [
    { href: `/${currentCountry}`, icon: Home, label: '홈' },
    { href: `/${currentCountry}/tips`, icon: Lightbulb, label: '생활팁' },
    { href: `/${currentCountry}/market`, icon: ShoppingBag, label: '마켓' },
    { href: `/${currentCountry}/community`, icon: Users, label: '커뮤니티' },
    { href: '/mypage', icon: User, label: '마이페이지' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      {showNav && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Left - Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navItems.slice(0, 3).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              {/* Mobile Left Spacer */}
              <div className="w-10 md:hidden" />

              {/* Center - Logo */}
              <Link href="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                <span className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">KNOWGL</span>
              </Link>

              {/* Right Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navItems.slice(3).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="hidden sm:block">
                  <PageTranslateButton />
                </div>
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {/* 언어 선택 드롭다운 */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1 p-1.5 sm:px-3 sm:py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="text-base sm:text-lg">{currentLang.flag}</span>
                    <ChevronDown className="w-3 h-3 hidden sm:block" />
                  </button>
                  
                  {showLangMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowLangMenu(false)} 
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code as Language)
                              setShowLangMenu(false)
                            }}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition',
                              language === lang.code ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                            )}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* 로그인/마이페이지 버튼 */}
                {authLoading ? (
                  <div className="p-1.5 sm:p-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-400" />
                  </div>
                ) : isAuthenticated ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                      href="/mypage"
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                      <User className="w-4 h-4" />
                      <span>마이페이지</span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      title="로그아웃"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">로그인</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn('flex-1', showNav ? 'pb-24 md:pb-0' : '')}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition',
                    isActive ? 'text-indigo-600' : 'text-gray-400'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
