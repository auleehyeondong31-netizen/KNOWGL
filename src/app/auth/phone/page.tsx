'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, ArrowLeft, Loader2, KeyRound, ChevronDown } from 'lucide-react'
import { signInWithPhone, verifyPhoneOtp } from '@/lib/auth'

// 주요 국가 코드 목록
const countryCodes = [
  { code: '+82', country: '🇰🇷', name: '한국' },
  { code: '+1', country: '🇺🇸', name: '미국/캐나다' },
  { code: '+81', country: '🇯🇵', name: '일본' },
  { code: '+86', country: '🇨🇳', name: '중국' },
  { code: '+886', country: '🇹🇼', name: '대만' },
  { code: '+852', country: '🇭🇰', name: '홍콩' },
  { code: '+65', country: '🇸🇬', name: '싱가포르' },
  { code: '+84', country: '🇻🇳', name: '베트남' },
  { code: '+66', country: '🇹🇭', name: '태국' },
  { code: '+63', country: '🇵🇭', name: '필리핀' },
  { code: '+62', country: '🇮🇩', name: '인도네시아' },
  { code: '+60', country: '🇲🇾', name: '말레이시아' },
  { code: '+91', country: '🇮🇳', name: '인도' },
  { code: '+44', country: '🇬🇧', name: '영국' },
  { code: '+49', country: '🇩🇪', name: '독일' },
  { code: '+33', country: '🇫🇷', name: '프랑스' },
  { code: '+61', country: '🇦🇺', name: '호주' },
  { code: '+64', country: '🇳🇿', name: '뉴질랜드' },
  { code: '+7', country: '🇷🇺', name: '러시아' },
  { code: '+55', country: '🇧🇷', name: '브라질' },
  { code: '+52', country: '🇲🇽', name: '멕시코' },
]

export default function PhoneLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [countryCode, setCountryCode] = useState('+82')
  const [phone, setPhone] = useState('')
  const [fullPhone, setFullPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCountryList, setShowCountryList] = useState(false)

  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0]

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 전화번호 포맷 (숫자만 추출 후 국가 코드 추가)
    let phoneNumber = phone.replace(/[^0-9]/g, '')
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.slice(1)
    }
    const formattedPhone = countryCode + phoneNumber

    try {
      const { error } = await signInWithPhone(formattedPhone)
      if (error) {
        setError(error.message)
        return
      }
      setFullPhone(formattedPhone)
      setStep('otp')
    } catch (err) {
      setError('인증번호 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await verifyPhoneOtp(fullPhone, otp)
      if (error) {
        setError('인증번호가 올바르지 않습니다.')
        return
      }
      if (data.user) {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('인증 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={() => step === 'otp' ? setStep('phone') : router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>뒤로</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-black text-indigo-600">KNOWGL</Link>
            <p className="text-gray-500 mt-2">
              {step === 'phone' ? '전화번호로 로그인' : '인증번호 입력'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            /* Phone Input Step */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <div className="flex gap-2">
                  {/* 국가 코드 선택 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryList(!showCountryList)}
                      className="flex items-center gap-2 px-3 py-3 border border-gray-200 rounded-xl hover:border-gray-300 transition bg-white min-w-[100px]"
                    >
                      <span className="text-lg">{selectedCountry.country}</span>
                      <span className="text-sm text-gray-600">{selectedCountry.code}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* 국가 드롭다운 */}
                    {showCountryList && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                        {countryCodes.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code)
                              setShowCountryList(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left"
                          >
                            <span className="text-lg">{c.country}</span>
                            <span className="text-sm text-gray-900">{c.name}</span>
                            <span className="text-sm text-gray-500 ml-auto">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 전화번호 입력 */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="1234-5678"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  국가를 선택하고 전화번호를 입력하세요. 인증번호가 SMS로 발송됩니다.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  '인증번호 받기'
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="6자리 인증번호"
                    maxLength={6}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {phone}로 발송된 인증번호를 입력하세요.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    확인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError(null)
                }}
                className="w-full py-3 text-gray-600 font-medium hover:text-gray-900 transition"
              >
                다른 번호로 시도
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <p className="text-center text-gray-600 mt-6">
            다른 방법으로 로그인하기{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              이메일 로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
