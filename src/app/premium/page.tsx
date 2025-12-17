'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Check, ArrowLeft, Sparkles, Languages, Zap, Shield } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { usePremium } from '@/hooks/usePremium'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'monthly',
    name: '월간 플랜',
    nameEn: 'Monthly',
    price: 4900,
    priceEn: '$3.99',
    period: '월',
    periodEn: '/mo',
    popular: false,
  },
  {
    id: 'yearly',
    name: '연간 플랜',
    nameEn: 'Yearly',
    price: 49000,
    priceEn: '$39.99',
    period: '년',
    periodEn: '/yr',
    popular: true,
    discount: '2개월 무료',
    discountEn: '2 months free',
  },
]

const features = [
  {
    icon: Languages,
    title: 'AI 번역',
    titleEn: 'AI Translation',
    description: 'GPT-4o 기반 고품질 번역',
    descriptionEn: 'High-quality GPT-4o translations',
    premium: true,
  },
  {
    icon: Sparkles,
    title: 'AI 비자 상담',
    titleEn: 'AI Visa Consultation',
    description: '24시간 AI 비자 질문 답변',
    descriptionEn: '24/7 AI visa Q&A',
    premium: true,
    comingSoon: true,
  },
  {
    icon: Zap,
    title: '프리미엄 정보',
    titleEn: 'Premium Content',
    description: '프리미엄 전용 취업/생활 팁',
    descriptionEn: 'Exclusive job & life tips',
    premium: true,
    comingSoon: true,
  },
  {
    icon: Shield,
    title: '광고 제거',
    titleEn: 'Ad-free Experience',
    description: '깔끔한 광고 없는 환경',
    descriptionEn: 'Clean, ad-free browsing',
    premium: true,
    comingSoon: true,
  },
]

export default function PremiumPage() {
  const { language } = useStore()
  const { isPremium, premiumUntil, premiumPlan } = usePremium()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  const isKorean = language === 'ko'

  const handleSubscribe = () => {
    // TODO: 결제 시스템 연동
    alert(isKorean ? '결제 시스템 준비 중입니다.' : 'Payment system coming soon.')
  }

  return (
    <WebLayout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            {isKorean ? '뒤로' : 'Back'}
          </Link>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isKorean ? 'KNOWGL 프리미엄' : 'KNOWGL Premium'}
            </h1>
            <p className="text-gray-600">
              {isKorean 
                ? '더 나은 해외 생활을 위한 프리미엄 기능을 만나보세요' 
                : 'Unlock premium features for a better expat experience'}
            </p>
          </div>

          {/* Current Status */}
          {isPremium && (
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-8 border border-amber-200">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="font-bold text-gray-900">
                    {isKorean ? '프리미엄 회원입니다!' : "You're a Premium member!"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isKorean ? '만료일: ' : 'Expires: '}
                    {premiumUntil?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {!isPremium && (
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                  className={cn(
                    'relative p-6 rounded-2xl border-2 text-left transition',
                    selectedPlan === plan.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {isKorean ? '인기' : 'Popular'}
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {isKorean ? plan.name : plan.nameEn}
                    </h3>
                    {selectedPlan === plan.id && (
                      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {isKorean ? `₩${plan.price.toLocaleString()}` : plan.priceEn}
                    </span>
                    <span className="text-gray-500">
                      /{isKorean ? plan.period : plan.periodEn}
                    </span>
                  </div>
                  {plan.discount && (
                    <p className="text-amber-600 text-sm font-medium mt-2">
                      🎁 {isKorean ? plan.discount : plan.discountEn}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {isKorean ? '프리미엄 혜택' : 'Premium Benefits'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {isKorean ? feature.title : feature.titleEn}
                        </h3>
                        {feature.comingSoon && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                            {isKorean ? '준비중' : 'Soon'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {isKorean ? feature.description : feature.descriptionEn}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          {!isPremium && (
            <div className="text-center">
              <button
                onClick={handleSubscribe}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition shadow-lg shadow-amber-500/30"
              >
                <Crown className="w-5 h-5" />
                {isKorean ? '프리미엄 시작하기' : 'Start Premium'}
              </button>
              <p className="text-gray-500 text-sm mt-4">
                {isKorean ? '언제든 취소 가능합니다' : 'Cancel anytime'}
              </p>
            </div>
          )}
        </div>
      </div>
    </WebLayout>
  )
}
