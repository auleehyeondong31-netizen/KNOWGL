'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Loader2, DollarSign, Tag, FileText, Image as ImageIcon } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { marketCategories } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const currencies: Record<string, { symbol: string; name: string }> = {
  kr: { symbol: '₩', name: 'KRW' },
  jp: { symbol: '¥', name: 'JPY' },
  au: { symbol: '$', name: 'AUD' },
  us: { symbol: '$', name: 'USD' },
  ca: { symbol: '$', name: 'CAD' },
  sg: { symbol: '$', name: 'SGD' },
  tw: { symbol: 'NT$', name: 'TWD' },
}

export default function SellMarketItemPage() {
  const params = useParams()
  const router = useRouter()
  const countryCode = params.country as string
  const { language } = useStore()
  const { showToast } = useToast()
  
  const isKorean = language === 'ko'
  const currency = currencies[countryCode] || currencies['kr']
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'housing',
    description: '',
    price: '',
    tags: '',
    imageUrl: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showToast(isKorean ? '제목을 입력해주세요' : 'Please enter a title', 'warning')
      return
    }
    if (!formData.description.trim()) {
      showToast(isKorean ? '설명을 입력해주세요' : 'Please enter a description', 'warning')
      return
    }
    
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('market_items')
        .insert({
          country: countryCode,
          category: formData.category,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseInt(formData.price) || 0,
          currency: currency.name,
          image_url: formData.imageUrl || null,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          user_id: '00000000-0000-0000-0000-000000000000', // 임시 user_id
        })
        .select()
        .single()

      if (error) throw error

      showToast(isKorean ? '등록 완료!' : 'Item listed!', 'success')
      router.push(`/${countryCode}/market`)
    } catch (err: any) {
      console.error('Error:', err)
      showToast(isKorean ? `등록 실패: ${err.message}` : `Failed: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WebLayout>
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            {isKorean ? '뒤로가기' : 'Back'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isKorean ? '지식 판매하기' : 'Sell Your Knowledge'}
          </h1>
          <p className="text-white/80 mt-2">
            {isKorean ? '유용한 정보나 가이드를 공유하고 수익을 얻으세요' : 'Share useful information and earn money'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Tag className="w-4 h-4 inline mr-2" />
              {isKorean ? '카테고리' : 'Category'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {marketCategories.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition border-2',
                    formData.category === cat.id
                      ? 'bg-amber-50 border-amber-500 text-amber-700'
                      : 'bg-gray-50 border-transparent text-gray-600 hover:border-gray-300'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FileText className="w-4 h-4 inline mr-2" />
              {isKorean ? '제목' : 'Title'} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={isKorean ? '예: 호주 워홀 비자 완벽 가이드' : 'e.g., Complete Guide to Australian WHV'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-2">{formData.title.length}/100</p>
          </div>

          {/* 설명 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {isKorean ? '상세 설명' : 'Description'} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={isKorean ? '판매할 지식/정보에 대해 자세히 설명해주세요...' : 'Describe your knowledge/information in detail...'}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-2">{formData.description.length}/2000</p>
          </div>

          {/* 가격 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 inline mr-2" />
              {isKorean ? '가격' : 'Price'} ({currency.name})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {currency.symbol}
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {isKorean ? '0을 입력하면 무료로 공개됩니다' : 'Enter 0 for free sharing'}
            </p>
          </div>

          {/* 이미지 URL */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              {isKorean ? '썸네일 이미지 URL (선택)' : 'Thumbnail Image URL (Optional)'}
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 태그 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {isKorean ? '태그 (쉼표로 구분)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder={isKorean ? '예: 워홀, 비자, 호주' : 'e.g., WHV, visa, Australia'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              {isKorean ? '취소' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isKorean ? '등록 중...' : 'Listing...'}
                </>
              ) : (
                isKorean ? '등록하기' : 'List Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </WebLayout>
  )
}
