'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Plus, MapPin, Building2, Home, Store, 
  Loader2, CheckCircle, Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { countries } from '@/lib/countries'

// 장소 타입
const placeTypes = [
  { id: 'job', name: '일자리', icon: Building2 },
  { id: 'housing', name: '주거', icon: Home },
  { id: 'amenity', name: '편의시설', icon: Store },
]

// 카테고리 옵션
const categoryOptions = {
  job: [
    { id: 'cafe', name: '카페' },
    { id: 'restaurant', name: '음식점' },
    { id: 'hotel', name: '호텔' },
    { id: 'office', name: '사무직' },
    { id: 'factory', name: '공장' },
    { id: 'academy', name: '학원' },
    { id: 'retail', name: '판매' },
  ],
  housing: [
    { id: 'oneroom', name: '원룸' },
    { id: 'sharehouse', name: '쉐어하우스' },
    { id: 'officetel', name: '오피스텔' },
    { id: 'goshiwon', name: '고시원' },
  ],
  amenity: [
    { id: 'mart', name: '마트' },
    { id: 'restaurant', name: '식당' },
    { id: 'hospital', name: '병원' },
    { id: 'bank', name: '은행' },
    { id: 'gas', name: '주유소' },
  ],
}

// 지역 옵션
const locationOptions = [
  '강남구', '마포구', '용산구', '서대문구', '중구', '광진구', '종로구', '송파구', '강서구'
]

export default function AdminPlacesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    country: 'kr',
    type: 'job' as 'job' | 'housing' | 'amenity',
    name: '',
    category: '',
    subtitle: '',
    description: '',
    address: '',
    location: '',
    lat: '',
    lng: '',
    imageUrl: '',
    tags: '',
    workHours: '',
    benefits: '',
    deposit: '',
    size: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 타입 변경 시 카테고리 초기화
    if (name === 'type') {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.address) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { data, error: insertError } = await supabase
        .from('places')
        .insert({
          country: formData.country,
          type: formData.type,
          name: formData.name,
          category: formData.category,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          address: formData.address,
          location: formData.location || null,
          lat: parseFloat(formData.lat) || 37.5665,
          lng: parseFloat(formData.lng) || 126.9780,
          image_url: formData.imageUrl || null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          work_hours: formData.workHours || null,
          benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()) : null,
          deposit: formData.deposit || null,
          size: formData.size || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        setError(`등록 실패: ${insertError.message}`)
        setIsSubmitting(false)
        return
      }

      setIsSubmitted(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      console.error('Submit error:', err)
      setError('등록 중 오류가 발생했습니다.')
      setIsSubmitting(false)
    }
  }

  // 등록 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">등록 완료!</h2>
          <p className="text-gray-500 mb-6">장소가 성공적으로 등록되었습니다.</p>
          <p className="text-sm text-gray-400">잠시 후 홈으로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">장소 등록 (관리자)</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 국가 선택 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">등록 국가 *</h2>
            <div className="grid grid-cols-4 gap-3">
              {countries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, country: c.code }))}
                  className={cn(
                    'p-3 rounded-xl border-2 transition flex flex-col items-center gap-2',
                    formData.country === c.code
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className={cn(
                    'text-xs font-medium',
                    formData.country === c.code ? 'text-indigo-600' : 'text-gray-600'
                  )}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 장소 타입 선택 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">장소 타입 *</h2>
            <div className="grid grid-cols-3 gap-3">
              {placeTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id as any, category: '' }))}
                    className={cn(
                      'p-4 rounded-xl border-2 transition flex flex-col items-center gap-2',
                      formData.type === type.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Icon className={cn(
                      'w-6 h-6',
                      formData.type === type.id ? 'text-indigo-600' : 'text-gray-400'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      formData.type === type.id ? 'text-indigo-600' : 'text-gray-600'
                    )}>{type.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">기본 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">장소명 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 스타벅스 강남역점"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">카테고리 선택</option>
                {categoryOptions[formData.type].map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="예: 바리스타 - 시급 12,000원"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="장소에 대한 상세 설명..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

          </div>

          {/* 위치 정보 */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">위치 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">주소 *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="예: 서울 강남구 강남대로 396"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지역구</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">지역 선택</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">위도</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="37.5665"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">경도</label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="126.9780"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 이미지 & 태그 */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4">이미지 & 태그</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">태그 (쉼표로 구분)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="예: 외국인 환영, 한국어 초급 OK, 4대보험"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 타입별 추가 정보 */}
          {formData.type === 'job' && (
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">일자리 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">근무시간</label>
                <input
                  type="text"
                  name="workHours"
                  value={formData.workHours}
                  onChange={handleChange}
                  placeholder="예: 09:00 - 18:00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">복지 (쉼표로 구분)</label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="예: 4대보험, 식사제공, 교통비"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {formData.type === 'housing' && (
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">주거 정보</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">보증금</label>
                <input
                  type="text"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="예: 500만원"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">크기</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="예: 20㎡"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                장소 등록하기
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
