'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'free', name: '자유', nameEn: 'Free' },
  { id: 'info', name: '정보', nameEn: 'Info' },
  { id: 'qna', name: 'Q&A', nameEn: 'Q&A' },
  { id: 'meetup', name: '모임', nameEn: 'Meetup' },
  { id: 'job', name: '구인', nameEn: 'Jobs' },
]

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const countryCode = params.country as string
  const postId = params.postId as string
  const { language } = useStore()
  const { user, isAuthenticated } = useAuth()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('free')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthor, setIsAuthor] = useState(false)

  const isKorean = language === 'ko'

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error: fetchError } = await supabase
          .from('community_posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (fetchError || !data) {
          setError(isKorean ? '게시글을 찾을 수 없습니다.' : 'Post not found.')
          return
        }

        // 작성자 확인
        if (user && data.user_id === user.id) {
          setIsAuthor(true)
          setTitle(data.title)
          setContent(data.content)
          setCategory(data.category)
        } else {
          setError(isKorean ? '수정 권한이 없습니다.' : 'No permission to edit.')
        }
      } catch (err) {
        console.error('Error:', err)
        setError(isKorean ? '오류가 발생했습니다.' : 'An error occurred.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchPost()
    } else {
      setLoading(false)
    }
  }, [postId, user, isKorean])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user || !isAuthor) {
      return
    }

    if (!title.trim() || !content.trim()) {
      setError(isKorean ? '제목과 내용을 입력해주세요.' : 'Please enter title and content.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('community_posts')
        .update({
          title: title.trim(),
          content: content.trim(),
          category: category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }

      router.push(`/${countryCode}/community/${postId}`)
    } catch (err) {
      console.error('Error updating post:', err)
      setError(isKorean ? '수정에 실패했습니다.' : 'Failed to update post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <WebLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </WebLayout>
    )
  }

  if (!isAuthenticated || !isAuthor) {
    return (
      <WebLayout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <p className="text-gray-600 mb-4">{error || (isKorean ? '접근 권한이 없습니다.' : 'No access.')}</p>
          <Link
            href={`/${countryCode}/community`}
            className="text-indigo-600 hover:underline"
          >
            {isKorean ? '커뮤니티로 돌아가기' : 'Back to Community'}
          </Link>
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
                href={`/${countryCode}/community/${postId}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg font-bold text-gray-900">
                {isKorean ? '글 수정' : 'Edit Post'}
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
                <Save className="w-4 h-4" />
              )}
              {isKorean ? '저장' : 'Save'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Save className="w-5 h-5" />
                )}
                {isKorean ? '수정 완료' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </WebLayout>
  )
}
