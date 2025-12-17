'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'

export default function EmailConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // URL에서 인증 상태 확인
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      setStatus('error')
      setMessage(errorDescription || '이메일 인증에 실패했습니다.')
    } else {
      // 인증 성공 - 온보딩으로 이동 안내
      setStatus('success')
      setMessage('이메일 인증이 완료되었습니다!')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 확인 중...</h2>
            <p className="text-gray-500">잠시만 기다려주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 완료!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <p className="text-gray-600 mb-4 text-sm">
              이제 프로필을 설정하고 서비스를 시작해보세요!
            </p>
            <Link
              href="/onboarding/nationality"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
            >
              프로필 설정하기 <ArrowRight className="w-5 h-5" />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">인증 실패</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="inline-block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
              >
                다시 회원가입
              </Link>
              <Link
                href="/"
                className="inline-block w-full py-3 text-gray-600 font-medium hover:text-gray-900 transition"
              >
                홈으로 이동
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
