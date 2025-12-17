'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Star, Camera, X, CheckCircle, 
  ThumbsUp, ThumbsDown, AlertCircle, Image as ImageIcon, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// 카테고리별 평점 항목
const ratingCategories = [
  { id: 'salary', name: '급여', nameEn: 'Salary' },
  { id: 'worklife', name: '워라밸', nameEn: 'Work-Life Balance' },
  { id: 'atmosphere', name: '분위기', nameEn: 'Atmosphere' },
  { id: 'growth', name: '성장성', nameEn: 'Growth' },
  { id: 'benefits', name: '복지', nameEn: 'Benefits' },
  { id: 'foreigner', name: '외국인친화', nameEn: 'Foreigner Friendly' },
]

// 목업 장소 데이터
const mockPlace = {
  id: 1,
  title: '스타벅스 강남역점',
  subtitle: '바리스타 - 시급 12,000원',
  type: 'job'
}

export default function ReviewWritePage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  
  const [overallRating, setOverallRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({})
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [tips, setTips] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleCategoryRating = (categoryId: string, rating: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [categoryId]: rating
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (overallRating === 0 || !pros.trim()) {
      setError('별점과 장점은 필수 입력 항목입니다.')
      return
    }

    if (!isAuthenticated || !user) {
      setError('리뷰를 작성하려면 로그인이 필요합니다.')
      router.push('/auth/login')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // 리뷰 내용 합치기
      const content = [
        `[장점] ${pros}`,
        cons ? `[단점] ${cons}` : '',
        tips ? `[팁] ${tips}` : ''
      ].filter(Boolean).join('\n\n')

      // sentiment 결정
      const sentiment = overallRating >= 4 ? 'positive' : overallRating >= 3 ? 'neutral' : 'negative'

      // 사용자 메타데이터에서 국적 가져오기
      const userNationality = user.user_metadata?.nationality || 'Unknown'
      const userName = isAnonymous ? '익명' : (user.user_metadata?.name || user.email?.split('@')[0] || 'User')

      // Supabase에 리뷰 저장
      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert({
          place_id: params.id as string,
          user_id: user.id,
          rating: overallRating,
          rating_details: categoryRatings,
          content,
          author_name: userName,
          author_country: userNationality,
          sentiment,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Review insert error:', insertError)
        console.error('Error details:', JSON.stringify(insertError, null, 2))
        setError(`리뷰 등록 실패: ${insertError.message || insertError.code || '알 수 없는 오류'}`)
        setIsSubmitting(false)
        return
      }

      console.log('Review saved:', data)
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      setTimeout(() => {
        router.push(`/place/${params.id}`)
      }, 2000)
    } catch (err) {
      console.error('Review submit error:', err)
      setError('리뷰 등록 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">리뷰가 등록되었습니다!</h2>
          <p className="text-gray-500 mb-6">소중한 리뷰 감사합니다. 다른 외국인들에게 큰 도움이 됩니다.</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <Star 
                key={i} 
                className={cn(
                  'w-8 h-8',
                  i <= overallRating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900">리뷰 작성</span>
            </div>
            <Link href="/" className="text-xl font-black text-indigo-600">KNOWGL</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Place Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{mockPlace.title}</h1>
              <p className="text-gray-500">{mockPlace.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">전체 평점</h2>
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(i => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setOverallRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={cn(
                      'w-12 h-12 transition',
                      i <= (hoverRating || overallRating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-gray-200 text-gray-200'
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              {overallRating === 0 && '별점을 선택해주세요'}
              {overallRating === 1 && '별로예요'}
              {overallRating === 2 && '그저 그래요'}
              {overallRating === 3 && '괜찮아요'}
              {overallRating === 4 && '좋아요'}
              {overallRating === 5 && '최고예요!'}
            </p>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">카테고리별 평점</h2>
          <p className="text-sm text-gray-500 mb-4">각 항목에 대해 평가해주세요 (선택)</p>
          <div className="space-y-4">
            {ratingCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-400 ml-2">{category.nameEn}</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button
                      key={i}
                      onClick={() => handleCategoryRating(category.id, i)}
                      className="p-1"
                    >
                      <Star 
                        className={cn(
                          'w-6 h-6 transition',
                          i <= (categoryRatings[category.id] || 0)
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-gray-200 text-gray-200'
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pros */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-900">장점</h2>
            <span className="text-rose-500 text-sm">*필수</span>
          </div>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="이 곳의 좋은 점을 알려주세요. 외국인으로서 느낀 장점이 있다면 더 좋아요!"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-sm text-gray-400 mt-2">{pros.length}/500자</p>
        </div>

        {/* Cons */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-gray-900">단점</h2>
          </div>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="아쉬웠던 점이나 개선이 필요한 부분을 알려주세요."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          />
          <p className="text-sm text-gray-400 mt-2">{cons.length}/500자</p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">외국인을 위한 팁</h2>
          </div>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="다른 외국인들에게 도움이 될 만한 팁이 있다면 공유해주세요. (예: 한국어 수준, 필요한 서류, 주의사항 등)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-900">사진 첨부</h2>
            <span className="text-sm text-gray-400">(최대 5장)</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24">
                <img 
                  src={photo} 
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {photos.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">추가</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="font-medium text-gray-900">익명으로 작성</h3>
              <p className="text-sm text-gray-500">닉네임 대신 '익명'으로 표시됩니다</p>
            </div>
            <div 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                isAnonymous ? 'bg-indigo-600' : 'bg-gray-300'
              )}
            >
              <div className={cn(
                'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow',
                isAnonymous ? 'translate-x-6' : 'translate-x-1'
              )} />
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
            <p className="text-rose-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || overallRating === 0 || !pros.trim()}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                리뷰 등록하기
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            허위 리뷰 작성 시 서비스 이용이 제한될 수 있습니다
          </p>
        </div>
      </main>
    </div>
  )
}
