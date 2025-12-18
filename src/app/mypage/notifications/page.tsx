'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Bell, MessageCircle, Heart, Star, 
  ShoppingBag, AlertTriangle, Calendar, Mail, Smartphone
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface NotificationSetting {
  id: string
  icon: any
  titleKo: string
  titleEn: string
  descriptionKo: string
  descriptionEn: string
  enabled: boolean
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'comments',
    icon: MessageCircle,
    titleKo: '댓글 알림',
    titleEn: 'Comment Notifications',
    descriptionKo: '내 게시글에 새 댓글이 달리면 알림',
    descriptionEn: 'Get notified when someone comments on your post',
    enabled: true,
  },
  {
    id: 'likes',
    icon: Heart,
    titleKo: '좋아요 알림',
    titleEn: 'Like Notifications',
    descriptionKo: '내 게시글이나 리뷰에 좋아요가 달리면 알림',
    descriptionEn: 'Get notified when someone likes your content',
    enabled: true,
  },
  {
    id: 'reviews',
    icon: Star,
    titleKo: '리뷰 알림',
    titleEn: 'Review Notifications',
    descriptionKo: '찜한 장소에 새 리뷰가 달리면 알림',
    descriptionEn: 'Get notified when new reviews are posted on saved places',
    enabled: false,
  },
  {
    id: 'market',
    icon: ShoppingBag,
    titleKo: '마켓 알림',
    titleEn: 'Market Notifications',
    descriptionKo: '관심 카테고리에 새 상품이 등록되면 알림',
    descriptionEn: 'Get notified when new items are listed in your categories',
    enabled: true,
  },
  {
    id: 'visa',
    icon: Calendar,
    titleKo: '비자 만료 알림',
    titleEn: 'Visa Expiry Reminder',
    descriptionKo: '비자 만료 30일, 7일 전 알림',
    descriptionEn: 'Reminder 30 and 7 days before visa expires',
    enabled: true,
  },
  {
    id: 'emergency',
    icon: AlertTriangle,
    titleKo: '긴급 알림',
    titleEn: 'Emergency Alerts',
    descriptionKo: '재해, 사건 등 긴급 상황 알림',
    descriptionEn: 'Alerts for disasters and emergencies',
    enabled: true,
  },
]

export default function NotificationsSettingsPage() {
  const router = useRouter()
  const { language } = useStore()
  const { showToast } = useToast()
  
  const isKorean = language === 'ko'
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
    showToast(isKorean ? '설정이 저장되었습니다' : 'Settings saved', 'success')
  }

  const toggleAll = (enabled: boolean) => {
    setSettings(prev => prev.map(s => ({ ...s, enabled })))
    showToast(isKorean ? '설정이 저장되었습니다' : 'Settings saved', 'success')
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
              {isKorean ? '알림 설정' : 'Notification Settings'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Push / Email Toggle */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">
            {isKorean ? '알림 수신 방법' : 'Notification Methods'}
          </h2>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-medium text-gray-900">
                  {isKorean ? '푸시 알림' : 'Push Notifications'}
                </p>
                <p className="text-sm text-gray-500">
                  {isKorean ? '앱 푸시 알림 받기' : 'Receive push notifications'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPushEnabled(!pushEnabled)
                showToast(isKorean ? '설정이 저장되었습니다' : 'Settings saved', 'success')
              }}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors',
                pushEnabled ? 'bg-indigo-600' : 'bg-gray-300'
              )}
            >
              <span className={cn(
                'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                pushEnabled ? 'right-1' : 'left-1'
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">
                  {isKorean ? '이메일 알림' : 'Email Notifications'}
                </p>
                <p className="text-sm text-gray-500">
                  {isKorean ? '중요 알림을 이메일로 받기' : 'Receive important alerts via email'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEmailEnabled(!emailEnabled)
                showToast(isKorean ? '설정이 저장되었습니다' : 'Settings saved', 'success')
              }}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors',
                emailEnabled ? 'bg-indigo-600' : 'bg-gray-300'
              )}
            >
              <span className={cn(
                'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                emailEnabled ? 'right-1' : 'left-1'
              )} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => toggleAll(true)}
            className="flex-1 py-3 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition"
          >
            {isKorean ? '모두 켜기' : 'Enable All'}
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            {isKorean ? '모두 끄기' : 'Disable All'}
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              {isKorean ? '알림 종류' : 'Notification Types'}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {settings.map((setting) => {
              const Icon = setting.icon
              return (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      setting.enabled ? 'bg-indigo-100' : 'bg-gray-100'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        setting.enabled ? 'text-indigo-600' : 'text-gray-400'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isKorean ? setting.titleKo : setting.titleEn}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isKorean ? setting.descriptionKo : setting.descriptionEn}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={cn(
                      'relative w-12 h-7 rounded-full transition-colors',
                      setting.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                      setting.enabled ? 'right-1' : 'left-1'
                    )} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
          <p className="text-sm text-amber-700">
            {isKorean 
              ? '💡 푸시 알림을 받으려면 브라우저 알림 권한을 허용해주세요.'
              : '💡 To receive push notifications, please allow browser notifications.'}
          </p>
        </div>
      </div>
    </WebLayout>
  )
}
