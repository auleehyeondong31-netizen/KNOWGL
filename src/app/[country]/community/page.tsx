'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, MessageCircle, Heart, Eye, Clock, TrendingUp, ThumbsUp, ThumbsDown, ArrowUpDown, Loader2 } from 'lucide-react'
import { PostSkeleton } from '@/components/ui/Skeleton'
import { WebLayout } from '@/components/layout/WebLayout'
import { CountryHeader, SearchInput, CategoryPills, EmptyState, QuickTranslate } from '@/components/common'
import { useStore } from '@/store/useStore'
import { communityCategories } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { postsByCountry, getCategoryColor } from '@/lib/mockData'
import { supabase } from '@/lib/supabase'
import type { CommunityPost } from '@/lib/types'

export default function CountryCommunityPage() {
  const params = useParams()
  const countryCode = params.country as string
  const { language } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('popular')
  const [dbPosts, setDbPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  // 사용자 반응 상태: { postId: 'like' | 'dislike' | null }
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'dislike' | null>>({})

  const isKorean = language === 'ko'
  const mockPosts = postsByCountry[countryCode] || postsByCountry['kr']

  // Supabase에서 게시글 불러오기
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('country', countryCode)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error fetching posts:', error)
        } else if (data) {
          const formattedPosts: CommunityPost[] = data.map(post => ({
            id: post.id,
            category: post.category,
            title: post.title,
            content: post.content,
            author: '익명',
            authorCountry: '🌍',
            createdAt: new Date(post.created_at).toLocaleDateString(),
            likes: post.like_count || 0,
            comments: post.comment_count || 0,
            views: post.view_count || 0,
            isPinned: post.is_pinned,
            isFromDB: true,
          }))
          setDbPosts(formattedPosts)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [countryCode])

  // DB 게시글 + Mock 게시글 합치기
  const allPosts = [...dbPosts, ...mockPosts]

  const filteredPosts = allPosts
    .filter(post => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false
      if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        // 인기순: 좋아요 - 싫어요 점수로 정렬
        const scoreA = (a.likes || 0) - (a.dislikes || 0)
        const scoreB = (b.likes || 0) - (b.dislikes || 0)
        return scoreB - scoreA
      }
      // 최신순: 날짜 기준 정렬
      return 0 // DB에서 이미 최신순으로 가져옴
    })

  // 좋아요/싫어요 클릭 핸들러 (상호 배타적)
  const handleReaction = async (e: React.MouseEvent, postId: string | number, type: 'like' | 'dislike') => {
    e.preventDefault()
    e.stopPropagation()
    
    const postIdStr = String(postId)
    const currentReaction = userReactions[postIdStr]
    
    // 이미 같은 반응을 눌렀으면 무시 (취소 기능 없음)
    if (currentReaction === type) return
    
    // 이미 반대 반응을 눌렀으면 무시 (한쪽만 선택 가능)
    if (currentReaction && currentReaction !== type) return
    
    // Mock 데이터는 로컬 상태만 업데이트
    if (typeof postId !== 'string') {
      setUserReactions(prev => ({ ...prev, [postIdStr]: type }))
      return
    }
    
    try {
      const column = type === 'like' ? 'like_count' : 'dislike_count'
      const post = dbPosts.find(p => p.id === postId)
      if (!post) return
      
      const currentCount = type === 'like' ? (post.likes || 0) : (post.dislikes || 0)
      
      await supabase
        .from('community_posts')
        .update({ [column]: currentCount + 1 })
        .eq('id', postId)
      
      // 사용자 반응 상태 업데이트
      setUserReactions(prev => ({ ...prev, [postIdStr]: type }))
      
      // 로컬 상태 업데이트
      setDbPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: type === 'like' ? (p.likes || 0) + 1 : p.likes,
            dislikes: type === 'dislike' ? (p.dislikes || 0) + 1 : p.dislikes,
          }
        }
        return p
      }))
    } catch (err) {
      console.error('Reaction error:', err)
    }
  }

  const getCategoryName = (category: string) => {
    const cat = communityCategories.find(c => c.id === category)
    return cat?.name || category
  }

  return (
    <WebLayout>
      <CountryHeader
        countryCode={countryCode}
        title="커뮤니티"
        titleEn="Community"
        gradientFrom="from-rose-500"
        gradientTo="to-pink-600"
        isKorean={isKorean}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-500 mt-1">
                {isKorean ? '정보를 공유하고 소통하세요' : 'Share information and connect'}
              </p>
            </div>
            <Link 
              href={`/${countryCode}/community/write`}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition font-semibold"
            >
              <Plus className="w-4 h-4" />
              {isKorean ? '글쓰기' : 'Write Post'}
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={isKorean ? '게시글 검색...' : 'Search posts...'}
            />
            <CategoryPills
              categories={communityCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              activeColor="rose"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-900">
                {selectedCategory === 'all' ? (isKorean ? '전체' : 'All') : getCategoryName(selectedCategory)}
                <span className="text-gray-400 font-normal ml-2">{filteredPosts.length}{isKorean ? '개' : ' posts'}</span>
              </h2>
              {/* 정렬 옵션 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy('popular')}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition',
                    sortBy === 'popular' 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  {isKorean ? '인기순' : 'Popular'}
                </button>
                <button
                  onClick={() => setSortBy('latest')}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition',
                    sortBy === 'latest' 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <Clock className="w-4 h-4" />
                  {isKorean ? '최신순' : 'Latest'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <PostSkeleton key={i} />
                  ))}
                </>
              ) : filteredPosts.map((post) => (
                <Link
                  href={post.isFromDB ? `/${countryCode}/community/${post.id}` : '#'}
                  key={post.id}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-semibold',
                        getCategoryColor(post.category)
                      )}>
                        {getCategoryName(post.category)}
                      </span>
                      {post.isPinned && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-md text-xs font-semibold">
                          📌 {isKorean ? '고정' : 'Pinned'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.createdAt}
                    </span>
                  </div>
                  
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {post.title}
                    </h3>
                    <QuickTranslate text={`${post.title}\n\n${post.content}`} />
                  </div>
                  
                  <p className="text-gray-500 line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{post.author}</span>
                        <span className="text-gray-400 text-sm ml-2">{post.authorCountry}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <button
                        onClick={(e) => handleReaction(e, post.id, 'like')}
                        disabled={userReactions[String(post.id)] === 'dislike'}
                        className={cn(
                          'flex items-center gap-1.5 text-sm transition btn-press',
                          userReactions[String(post.id)] === 'like' 
                            ? 'text-green-600 font-semibold' 
                            : userReactions[String(post.id)] === 'dislike'
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:text-green-600'
                        )}
                      >
                        <ThumbsUp className={cn('w-4 h-4', userReactions[String(post.id)] === 'like' && 'fill-green-600')} /> {post.likes || 0}
                      </button>
                      <button
                        onClick={(e) => handleReaction(e, post.id, 'dislike')}
                        disabled={userReactions[String(post.id)] === 'like'}
                        className={cn(
                          'flex items-center gap-1.5 text-sm transition btn-press',
                          userReactions[String(post.id)] === 'dislike' 
                            ? 'text-red-500 font-semibold' 
                            : userReactions[String(post.id)] === 'like'
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:text-red-500'
                        )}
                      >
                        <ThumbsDown className={cn('w-4 h-4', userReactions[String(post.id)] === 'dislike' && 'fill-red-500')} /> {post.dislikes || 0}
                      </button>
                      <span className="flex items-center gap-1.5 text-sm">
                        <MessageCircle className="w-4 h-4" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Eye className="w-4 h-4" /> {post.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <EmptyState
                icon={MessageCircle}
                title={isKorean ? '게시글이 없습니다' : 'No posts found'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                {isKorean ? '인기 게시글' : 'Popular Posts'}
              </h3>
              <div className="space-y-3">
                {mockPosts.slice(0, 3).map((post, idx) => (
                  <div key={post.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                    <span className="text-lg font-bold text-rose-500">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                {isKorean ? '커뮤니티 현황' : 'Community Stats'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">1,234</div>
                  <div className="text-sm text-gray-500">{isKorean ? '총 게시글' : 'Total Posts'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">567</div>
                  <div className="text-sm text-gray-500">{isKorean ? '회원 수' : 'Members'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  )
}
