'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe, MessageCircle, Apple, Chrome, Phone, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { language } = useStore()
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState({ code: '+82', name: 'Korea' })

  const countryCodes = [
    { code: '+82', name: 'Korea' },
    { code: '+1', name: 'USA' },
    { code: '+81', name: 'Japan' },
    { code: '+86', name: 'China' },
    { code: '+84', name: 'Vietnam' },
    { code: '+66', name: 'Thailand' },
    { code: '+63', name: 'Philippines' },
  ]

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    router.push('/onboarding/nationality')
  }

  const handleSendCode = () => {
    if (phoneNumber.length >= 8) {
      console.log(`Sending verification code to ${selectedCountry.code}${phoneNumber}`)
      setIsCodeSent(true)
    }
  }

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      console.log(`Verifying code: ${verificationCode}`)
      router.push('/onboarding/nationality')
    }
  }

  // Phone Login Modal
  if (showPhoneLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button 
                onClick={() => { setShowPhoneLogin(false); setIsCodeSent(false); setPhoneNumber(''); setVerificationCode(''); }}
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

        <main className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">휴대전화로 로그인</h1>
                <p className="text-gray-500">인증번호를 받아 로그인하세요</p>
              </div>

              {!isCodeSent ? (
                <div className="space-y-4">
                  {/* Country Code Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">국가 선택</label>
                    <select 
                      value={selectedCountry.code}
                      onChange={(e) => setSelectedCountry(countryCodes.find(c => c.code === e.target.value) || countryCodes[0])}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">휴대전화 번호</label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium">
                        {selectedCountry.code}
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="01012345678"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSendCode}
                    disabled={phoneNumber.length < 8}
                  >
                    인증번호 받기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl mb-4">
                    <p className="text-green-700 font-medium">인증번호가 발송되었습니다</p>
                    <p className="text-green-600 text-sm">{selectedCountry.code} {phoneNumber}</p>
                  </div>

                  {/* Verification Code Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">인증번호 6자리</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button 
                    className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6}
                  >
                    확인
                  </Button>

                  <button 
                    onClick={() => { setIsCodeSent(false); setVerificationCode(''); }}
                    className="w-full text-center text-indigo-600 text-sm font-medium hover:underline"
                  >
                    다른 번호로 인증하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-black text-indigo-600">KNOWGL</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg">
                <Globe className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">KNOWGL에 오신 것을 환영합니다</h1>
              <p className="text-gray-500">외국인을 위한 일자리 & 주거 리뷰 플랫폼</p>
            </div>

            {/* Login Buttons */}
            <div className="space-y-3">
              <Button 
                variant="kakao" 
                className="w-full h-12 text-base"
                onClick={() => handleSocialLogin('kakao')}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                {t('login_kakao', language as any)}
              </Button>

              {/* WeChat Login */}
              <button 
                onClick={() => handleSocialLogin('wechat')}
                className="w-full h-12 text-base flex items-center justify-center gap-3 bg-[#07C160] hover:bg-[#06AD56] text-white font-semibold rounded-lg transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                WeChat으로 로그인
              </button>

              <Button 
                variant="apple" 
                className="w-full h-12 text-base"
                onClick={() => handleSocialLogin('apple')}
              >
                <Apple className="w-5 h-5 mr-3" />
                {t('login_apple', language as any)}
              </Button>

              <Button 
                variant="google" 
                className="w-full h-12 text-base"
                onClick={() => handleSocialLogin('google')}
              >
                <Chrome className="w-5 h-5 mr-3" />
                {t('login_google', language as any)}
              </Button>

              <div className="relative py-3 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">또는</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <Button 
                variant="secondary" 
                className="w-full h-12 text-base"
                onClick={() => setShowPhoneLogin(true)}
              >
                <Phone className="w-5 h-5 mr-3" />
                휴대전화로 로그인
              </Button>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                {t('login_terms', language as any)}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl">💼</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">일자리 리뷰</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl">🏠</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">주거 리뷰</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">AI 요약</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
