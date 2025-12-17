'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Map, ShoppingBag, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { t } from '@/lib/i18n'

const navItems = [
  { id: 'map', path: '/map', icon: Map, labelKey: 'tab_map' as const },
  { id: 'market', path: '/market', icon: ShoppingBag, labelKey: 'tab_market' as const },
  { id: 'home', path: '/', icon: Home, labelKey: 'tab_home' as const },
  { id: 'community', path: '/community', icon: MessageCircle, labelKey: 'tab_community' as const },
  { id: 'mypage', path: '/mypage', icon: User, labelKey: 'tab_mypage' as const },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useStore()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-safe">
      <div className="flex justify-around items-end h-20 px-2 pb-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const isHome = item.id === 'home'

          if (isHome) {
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="relative -mt-6"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all',
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  )}
                >
                  <item.icon className="w-6 h-6" />
                </div>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={cn(
                'flex flex-col items-center justify-center w-14 transition-colors',
                active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">
                {t(item.labelKey, language as any)}
              </span>
            </button>
          )
        })}
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full opacity-20" />
    </nav>
  )
}
