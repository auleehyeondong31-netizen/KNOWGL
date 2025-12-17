'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Eye, Clock, MoreVertical, Edit, Trash2, Send, Loader2 } from 'lucide-react'
import { WebLayout } from '@/components/layout/WebLayout'
import { QuickTranslate } from '@/components/common'
import { useStore } from '@/store/useStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { communityCategories } from '@/lib/constants'
import { getCategoryColor } from '@/lib/mockData'

interface Post {
  id: string
  user_id: string
  category: string
  title: string
  content: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  is_pinned: boolean
}

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
  like_count: number
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const countryCode = params.country as string
  const postId = params.postId as string
  const { language } = useStore()
  const { user, isAuthenticated } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isKorean = language === 'ko'
  const isAuthor = user && post && user.id === post.user_id

  useEffect(() => {
    async function fetchPost() {
      try {
        // 게시글 조회
        const { data: postData, error: postError } = await supabase
          .from('community_posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (postError || !postData) {
          console.error('Error fetching post:', postError)
          return
        }

        setPost(postData)

        // 조회수 증가
        await supabase
          .from('community_posts')
          .update({ view_count: (postData.view_count || 0) + 1 })
          .eq('id', postId)

        // 댓글 조회
        const { data: commentsData } = await supabase
          .from('community_comments')
          .select('*')
          .eq('post_id', postId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true })

        if (commentsData) {
          setComments(commentsData)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user || !newComment.trim()) return

    setSubmittingComment(true)
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setComments([...comments, data])
        setNewComment('')
        
        // 댓글 수 증가
        await supabase
          .from('community_posts')
          .update({ comment_count: (post?.comment_count || 0) + 1 })
          .eq('id', postId)
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(isKorean ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_deleted: true })
        .eq('id', postId)

      if (error) throw error

      router.push(`/${countryCode}/community`)
    } catch (err) {
      console.error('Error deleting post:', err)
    } finally {
      setDeleting(false)
    }
  }

  const getCategoryName = (category: string) => {
    const cat = communityCategories.find(c => c.id === category)
    return cat?.name || category
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

  if (!post) {
    return (
      <WebLayout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-gray-600 mb-4">
            {isKorean ? '게시글을 찾을 수 없습니다.' : 'Post not found.'}
          </p>
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
            <Link
              href={`/${countryCode}/community`}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href={`/${countryCode}/community/${postId}/edit`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        {isKorean ? '수정' : 'Edit'}
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isKorean ? '삭제' : 'Delete'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={cn(
                'px-2.5 py-1 rounded-md text-xs font-semibold',
                getCategoryColor(post.category)
              )}>
                {getCategoryName(post.category)}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <QuickTranslate text={`${post.title}\n\n${post.content}`} />
            </div>

            <div className="prose prose-gray max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-gray-400">
              <span className="flex items-center gap-1.5 text-sm">
                <Heart className="w-4 h-4" /> {post.like_count || 0}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <MessageCircle className="w-4 h-4" /> {comments.length}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <Eye className="w-4 h-4" /> {post.view_count || 0}
              </span>
            </div>
          </article>

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">
              {isKorean ? '댓글' : 'Comments'} ({comments.length})
            </h2>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isKorean ? '댓글을 입력하세요' : 'Write a comment'}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {submittingComment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <Link href="/auth/login" className="text-indigo-600 hover:underline">
                  {isKorean ? '로그인하고 댓글을 작성하세요' : 'Login to write a comment'}
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-400 py-8">
                  {isKorean ? '아직 댓글이 없습니다.' : 'No comments yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}
