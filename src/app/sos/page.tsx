'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Cross, Pill, Wallet, MapPin, Phone, 
  AlertTriangle, Volume2, Copy, Check, Globe
} from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface SOSCard {
  id: string
  icon: any
  titleKo: string
  titleEn: string
  messageKo: string
  messageEn: string
  messageJa: string
  messageZh: string
  messageVi: string
  color: string
  bgColor: string
}

const sosCards: SOSCard[] = [
  {
    id: 'hospital',
    icon: Cross,
    titleKo: '병원 가주세요',
    titleEn: 'Hospital Please',
    messageKo: '아파요. 병원에 데려다 주세요.',
    messageEn: 'I am sick. Please take me to the hospital.',
    messageJa: '体の具合が悪いです。病院に連れて行ってください。',
    messageZh: '我生病了，请带我去医院。',
    messageVi: 'Tôi bị ốm. Làm ơn đưa tôi đến bệnh viện.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    id: 'pharmacy',
    icon: Pill,
    titleKo: '약국 어디예요?',
    titleEn: 'Pharmacy Location',
    messageKo: '약국이 어디에 있나요? 약이 필요해요.',
    messageEn: 'Where is the pharmacy? I need medicine.',
    messageJa: '薬局はどこですか？薬が必要です。',
    messageZh: '药店在哪里？我需要药。',
    messageVi: 'Hiệu thuốc ở đâu? Tôi cần thuốc.',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
  },
  {
    id: 'wallet',
    icon: Wallet,
    titleKo: '지갑을 잃어버렸어요',
    titleEn: 'Lost Wallet',
    messageKo: '지갑을 잃어버렸어요. 도와주세요.',
    messageEn: 'I lost my wallet. Please help me.',
    messageJa: '財布を失くしました。助けてください。',
    messageZh: '我丢了钱包，请帮帮我。',
    messageVi: 'Tôi bị mất ví. Hãy giúp tôi.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'address',
    icon: MapPin,
    titleKo: '이 주소로 가주세요',
    titleEn: 'Go to Address',
    messageKo: '이 주소로 데려다 주세요.',
    messageEn: 'Please take me to this address.',
    messageJa: 'この住所へ連れて行ってください。',
    messageZh: '请带我去这个地址。',
    messageVi: 'Làm ơn đưa tôi đến địa chỉ này.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
]

const emergencyNumbers: Record<string, { police: string; ambulance: string; fire: string }> = {
  kr: { police: '112', ambulance: '119', fire: '119' },
  jp: { police: '110', ambulance: '119', fire: '119' },
  au: { police: '000', ambulance: '000', fire: '000' },
  us: { police: '911', ambulance: '911', fire: '911' },
  ca: { police: '911', ambulance: '911', fire: '911' },
  sg: { police: '999', ambulance: '995', fire: '995' },
  tw: { police: '110', ambulance: '119', fire: '119' },
}

const localLanguages: Record<string, string> = {
  kr: '한국어',
  jp: '日本語',
  au: 'English',
  us: 'English',
  ca: 'English/Français',
  sg: 'English/中文',
  tw: '中文',
}

export default function SOSPage() {
  const router = useRouter()
  const { language, onboardingData } = useStore()
  const { showToast } = useToast()
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [customAddress, setCustomAddress] = useState('')

  const isKorean = language === 'ko'
  const currentCountry = onboardingData.destination || 'kr'
  const emergencyNum = emergencyNumbers[currentCountry] || emergencyNumbers['kr']

  const getMessage = (card: SOSCard) => {
    switch (language) {
      case 'ja': return card.messageJa
      case 'zh': return card.messageZh
      case 'vi': return card.messageVi
      case 'en': return card.messageEn
      default: return card.messageKo
    }
  }

  const getLocalMessage = (card: SOSCard) => {
    switch (currentCountry) {
      case 'jp': return card.messageJa
      case 'tw': case 'sg': return card.messageZh
      default: return card.messageEn
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast(isKorean ? '복사되었습니다' : 'Copied!', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const speakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = currentCountry === 'jp' ? 'ja-JP' 
      : currentCountry === 'tw' ? 'zh-TW' 
      : currentCountry === 'kr' ? 'ko-KR' 
      : 'en-US'
    speechSynthesis.speak(utterance)
  }

  return (
    <WebLayout showNav={false}>
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  {isKorean ? 'SOS 카드' : 'SOS Card'}
                </h1>
                <p className="text-sm text-white/80">
                  {isKorean ? '긴급 상황 시 보여주세요' : 'Show in emergency'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Emergency Numbers */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              {isKorean ? '긴급 전화번호' : 'Emergency Numbers'}
              <span className="text-sm font-normal text-gray-500">
                ({currentCountry.toUpperCase()})
              </span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`tel:${emergencyNum.police}`}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
              >
                <span className="text-2xl font-bold text-blue-600">{emergencyNum.police}</span>
                <span className="text-sm text-blue-700">{isKorean ? '경찰' : 'Police'}</span>
              </a>
              <a
                href={`tel:${emergencyNum.ambulance}`}
                className="flex flex-col items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition"
              >
                <span className="text-2xl font-bold text-red-600">{emergencyNum.ambulance}</span>
                <span className="text-sm text-red-700">{isKorean ? '구급차' : 'Ambulance'}</span>
              </a>
              <a
                href={`tel:${emergencyNum.fire}`}
                className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
              >
                <span className="text-2xl font-bold text-orange-600">{emergencyNum.fire}</span>
                <span className="text-sm text-orange-700">{isKorean ? '소방서' : 'Fire'}</span>
              </a>
            </div>
          </div>

          {/* SOS Cards */}
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              {isKorean ? '긴급 상황 카드' : 'Emergency Cards'}
            </h2>
            
            {sosCards.map((card) => {
              const Icon = card.icon
              const isSelected = selectedCard === card.id
              
              return (
                <div
                  key={card.id}
                  className={cn(
                    'bg-white rounded-2xl border-2 overflow-hidden transition-all',
                    isSelected ? card.bgColor : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setSelectedCard(isSelected ? null : card.id)}
                    className="w-full p-5 flex items-center gap-4"
                  >
                    <div className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center',
                      card.bgColor
                    )}>
                      <Icon className={cn('w-7 h-7', card.color)} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-gray-900">
                        {isKorean ? card.titleKo : card.titleEn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isKorean ? '터치해서 카드 펼치기' : 'Tap to expand card'}
                      </p>
                    </div>
                  </button>

                  {/* Expanded Card */}
                  {isSelected && (
                    <div className="px-5 pb-5 space-y-4 animate-fade-in">
                      {/* Address Input for Address Card */}
                      {card.id === 'address' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isKorean ? '주소 입력' : 'Enter Address'}
                          </label>
                          <input
                            type="text"
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                            placeholder={isKorean ? '예: 서울시 강남구 역삼동 123' : 'e.g., 123 Main St'}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      )}

                      {/* Message in User's Language */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {isKorean ? '내 언어' : 'My Language'}
                          </span>
                          <button
                            onClick={() => copyToClipboard(getMessage(card), card.id + '-my')}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                          >
                            {copiedId === card.id + '-my' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          {getMessage(card)}
                          {card.id === 'address' && customAddress && (
                            <span className="block mt-2 text-blue-600">{customAddress}</span>
                          )}
                        </p>
                      </div>

                      {/* Message in Local Language */}
                      <div className={cn('rounded-xl p-4', card.bgColor)}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {localLanguages[currentCountry]} ({isKorean ? '현지어' : 'Local'})
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => speakMessage(getLocalMessage(card))}
                              className="p-1.5 hover:bg-white/50 rounded-lg transition"
                              title={isKorean ? '음성 재생' : 'Play Audio'}
                            >
                              <Volume2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => copyToClipboard(getLocalMessage(card), card.id + '-local')}
                              className="p-1.5 hover:bg-white/50 rounded-lg transition"
                            >
                              {copiedId === card.id + '-local' ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className={cn('text-2xl font-bold', card.color)}>
                          {getLocalMessage(card)}
                          {card.id === 'address' && customAddress && (
                            <span className="block mt-2">{customAddress}</span>
                          )}
                        </p>
                      </div>

                      {/* Show This Card Button */}
                      <button
                        onClick={() => {
                          // Full screen card display
                          const message = getLocalMessage(card) + 
                            (card.id === 'address' && customAddress ? '\n' + customAddress : '')
                          alert(message)
                        }}
                        className={cn(
                          'w-full py-4 rounded-xl font-bold text-white transition',
                          card.id === 'hospital' ? 'bg-red-500 hover:bg-red-600' :
                          card.id === 'pharmacy' ? 'bg-green-500 hover:bg-green-600' :
                          card.id === 'wallet' ? 'bg-amber-500 hover:bg-amber-600' :
                          'bg-blue-500 hover:bg-blue-600'
                        )}
                      >
                        {isKorean ? '📱 이 카드 보여주기' : '📱 Show This Card'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-3">
              {isKorean ? '💡 안전 팁' : '💡 Safety Tips'}
            </h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• {isKorean ? '여권 사본을 항상 휴대하세요' : 'Always carry a copy of your passport'}</li>
              <li>• {isKorean ? '숙소 주소를 저장해두세요' : 'Save your accommodation address'}</li>
              <li>• {isKorean ? '대사관 연락처를 저장하세요' : 'Save embassy contact information'}</li>
              <li>• {isKorean ? '여행자 보험에 가입하세요' : 'Get travel insurance'}</li>
            </ul>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}
