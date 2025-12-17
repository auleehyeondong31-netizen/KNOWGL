'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'free', name: '자유', nameEn: 'Free', color: 'gray' },
  { id: 'info', name: '정보', nameEn: 'Info', color: 'blue' },
  { id: 'qna', name: 'Q&A', nameEn: 'Q&A', color: 'green' },
  { id: 'meetup', name: '모임', nameEn: 'Meetup', color: 'purple' },
  { id: 'job', name: '구인', nameEn: 'Jobs', color: 'orange' },
]

export default function CommunityWritePage() {
  const params = useParams()
  const router = useRouter()
  const countryCode = params.country as string
  const { language } = useStore()
  const { user, isAuthenticated } = useAuth()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('free')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isKorean = language === 'ko'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      setError(isKorean ? '로그인이 필요합니다.' : 'Please login first.')
      return
    }

    if (!title.trim() || !content.trim()) {
      setError(isKorean ? '제목과 내용을 입력해주세요.' : 'Please enter title and content.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          country: countryCode,
          category: category,
          title: title.trim(),
          content: content.trim(),
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // 성공 시 커뮤니티 페이지로 이동
      router.push(`/${countryCode}/community`)
    } catch (err: any) {
      console.error('Error creating post:', err)
      // 에러 메시지 상세 표시
      const errorMsg = err?.message || err?.details || JSON.stringify(err)
      setError(`${isKorean ? '게시글 작성에 실패했습니다' : 'Failed to create post'}: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return (
      <WebLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {isKorean ? '로그인이 필요합니다.' : 'Please login first.'}
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {isKorean ? '로그인하기' : 'Login'}
            </Link>
          </div>
        </div>
      </WebLayout>
    )
  }

  return (
    <WebLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/${countryCode}/community`}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg font-bold text-gray-900">
                {isKorean ? '글쓰기' : 'Write Post'}
              </h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isKorean ? '등록' : 'Post'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '카테고리' : 'Category'}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition',
                      category === cat.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {isKorean ? cat.name : cat.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '제목' : 'Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isKorean ? '제목을 입력하세요' : 'Enter title'}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isKorean ? '내용' : 'Content'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isKorean ? '내용을 입력하세요' : 'Enter content'}
                rows={10}
                maxLength={5000}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/5000</p>
            </div>

            {/* Submit Button (Mobile) */}
            <div className="md:hidden pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isKorean ? '게시글 등록' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </WebLayout>
  )
}
