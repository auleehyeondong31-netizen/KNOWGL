'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, ChevronRight, Bell, Shield, Globe, CreditCard, 
  HelpCircle, LogOut, Star, FileText, Heart, MessageCircle,
  AlertTriangle, Crown, User, Edit, Camera
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const menuItems = [
  { 
    section: '내 활동',
    items: [
      { icon: Star, label: '내 리뷰', count: 12, color: 'text-yellow-500', href: '/mypage/reviews' },
      { icon: FileText, label: '구매한 지식', count: 5, color: 'text-amber-500', href: '/mypage/purchases' },
      { icon: Heart, label: '찜한 장소', count: 23, color: 'text-rose-500', href: '/mypage/favorites' },
      { icon: MessageCircle, label: '내 게시글', count: 8, color: 'text-blue-500', href: '/mypage/posts' },
    ]
  },
  {
    section: '설정',
    items: [
      { icon: Bell, label: '알림 설정', color: 'text-gray-600', href: '/mypage/notifications' },
      { icon: Globe, label: '언어 설정', color: 'text-gray-600', href: '/mypage/language' },
      { icon: Shield, label: '개인정보 보호', color: 'text-gray-600', href: '/mypage/privacy' },
      { icon: CreditCard, label: '결제 관리', color: 'text-gray-600', href: '/mypage/payments' },
    ]
  },
  {
    section: '지원',
    items: [
      { icon: HelpCircle, label: '고객센터', color: 'text-gray-600', href: '/mypage/support' },
      { icon: AlertTriangle, label: 'SOS 카드', color: 'text-red-500', href: '/mypage/sos' },
    ]
  }
]

export default function MyPage() {
  const router = useRouter()
  const { language, onboardingData, setOnboarded } = useStore()
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const handleLogout = () => {
    setOnboarded(false)
    router.push('/login')
  }

  return (
    <WebLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 h-24 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pt-16 pb-6 px-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">KNOWGL 유저</h2>
                    <p className="text-gray-500">{onboardingData.destination || '한국'} 거주 중</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Edit className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">12</div>
                    <div className="text-sm text-gray-500">리뷰</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">5</div>
                    <div className="text-sm text-gray-500">구매</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">23</div>
                    <div className="text-sm text-gray-500">찜</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Banner */}
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 flex items-center justify-between text-white shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <Crown className="w-10 h-10" />
                <div className="text-left">
                  <div className="font-bold text-lg">프리미엄 멤버십</div>
                  <div className="text-sm text-white/80">광고 없이 모든 기능 이용하기</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Visa Alert */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-rose-700 mb-1">비자 만료 알림</h3>
                  <p className="text-rose-600">D-2 비자가 30일 후 만료됩니다</p>
                  <button className="mt-3 text-sm font-bold text-rose-700 hover:underline">
                    연장 방법 보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Menu */}
          <div className="lg:col-span-2 space-y-6">
            {menuItems.map((section) => (
              <div key={section.section}>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  {section.section}
                </h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {section.items.map((item, idx) => (
                      <button
                        key={item.label}
                        className={cn(
                          'px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition',
                          idx % 2 === 0 && 'md:border-r border-gray-100',
                          idx < section.items.length - 2 && 'border-b border-gray-100',
                          idx === section.items.length - 2 && section.items.length % 2 === 0 && 'border-b md:border-b-0 border-gray-100',
                          section.items.length % 2 !== 0 && idx === section.items.length - 1 && 'md:col-span-2'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            item.color === 'text-yellow-500' && 'bg-yellow-50',
                            item.color === 'text-amber-500' && 'bg-amber-50',
                            item.color === 'text-rose-500' && 'bg-rose-50',
                            item.color === 'text-blue-500' && 'bg-blue-50',
                            item.color === 'text-gray-600' && 'bg-gray-100',
                            item.color === 'text-red-500' && 'bg-red-50',
                          )}>
                            <item.icon className={cn('w-5 h-5', item.color)} />
                          </div>
                          <span className="font-medium text-gray-900">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {'count' in item && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600 font-medium">
                              {item.count}
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full py-4 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">프리미엄 멤버십</h2>
              <p className="text-gray-500">광고 없이 모든 기능을 이용하세요</p>
            </div>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">✓</span>
                <span className="text-gray-700">모든 리뷰 무제한 열람</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">✓</span>
                <span className="text-gray-700">광고 없는 깔끔한 화면</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">✓</span>
                <span className="text-gray-700">AI 챗봇 무제한 사용</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">✓</span>
                <span className="text-gray-700">비자 만료 알림 서비스</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                닫기
              </button>
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-white hover:shadow-lg transition">
                ₩9,900/월 구독
              </button>
            </div>
          </div>
        </div>
      )}
    </WebLayout>
  )
}
