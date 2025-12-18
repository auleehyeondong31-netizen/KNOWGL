'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Heart, Share2, Star, MapPin, Clock, DollarSign,
  ThumbsUp, ThumbsDown, MessageCircle, Sparkles, ChevronRight,
  Users, Smile, Frown, Meh, Home, Building2, ExternalLink,
  X, Send, Phone, Mail, CheckCircle, Briefcase, Calendar, Loader2
} from 'lucide-react'
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, ResponsiveContainer 
} from 'recharts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePlaceDetail } from '@/hooks/usePlaceDetail'

// 기본 AI 요약 데이터 (리뷰가 쌓이면 AI가 생성)
const defaultAiSummary = {
  positive: ['아직 리뷰가 부족합니다'],
  negative: ['아직 리뷰가 부족합니다'],
  summary: '리뷰가 더 쌓이면 AI가 자동으로 요약해드립니다.'
}

// 기본 레이더 차트 데이터
const defaultRadarData = [
  { category: '급여', score: 0, fullMark: 5 },
  { category: '워라밸', score: 0, fullMark: 5 },
  { category: '분위기', score: 0, fullMark: 5 },
  { category: '성장성', score: 0, fullMark: 5 },
  { category: '복지', score: 0, fullMark: 5 },
  { category: '외국인친화', score: 0, fullMark: 5 },
]

export default function PlaceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const placeId = params.id as string
  
  // Supabase 연동 훅 (미설정 시 mock 데이터 자동 사용)
  const { place: placeData, reviews: dbReviews, loading, isFromSupabase } = usePlaceDetail(placeId)
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'reviews'>('ai')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all')
  const [reviewSort, setReviewSort] = useState<'latest' | 'helpful'>('helpful')
  // 리뷰 반응 상태: { reviewId: 'like' | 'dislike' | null }
  const [reviewReactions, setReviewReactions] = useState<Record<string, 'like' | 'dislike' | null>>({})

  // 리뷰 좋아요/싫어요 핸들러 (상호 배타적)
  const handleReviewReaction = (reviewId: string, type: 'like' | 'dislike') => {
    const currentReaction = reviewReactions[reviewId]
    
    // 이미 같은 반응을 눌렀으면 무시
    if (currentReaction === type) return
    
    // 이미 반대 반응을 눌렀으면 무시
    if (currentReaction && currentReaction !== type) return
    
    setReviewReactions(prev => ({ ...prev, [reviewId]: type }))
  }
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredDate: '',
    nationality: '',
    koreanLevel: 'beginner',
    visaType: '',
    visaExpiry: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }
  
  // 데이터 없을 때
  if (!placeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">장소 정보를 찾을 수 없습니다.</p>
          <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-medium">뒤로 가기</button>
        </div>
      </div>
    )
  }
  
  // Supabase 데이터를 기존 형식으로 변환
  const place = {
    id: placeData.id,
    type: placeData.type,
    title: placeData.name,
    subtitle: placeData.subtitle || '',
    location: placeData.address,
    rating: dbReviews.length > 0 
      ? (dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length).toFixed(1) 
      : 0,
    totalReviews: dbReviews.length,
    image: placeData.imageUrl,
    tags: placeData.tags,
    workHours: placeData.workHours || '09:00 - 18:00',
    benefits: placeData.benefits || [],
    description: placeData.description || '',
    // AI 요약은 나중에 구현 - 지금은 기본값
    aiSummary: defaultAiSummary,
    radarData: defaultRadarData,
    // 리뷰는 DB에서 가져온 데이터만 사용 (목업 제거)
    reviews: dbReviews.map(r => ({
      id: r.id,
      author: r.authorName || '익명',
      country: r.authorCountry || 'Unknown',
      rating: r.rating,
      date: r.date,
      content: r.content,
      helpful: r.helpfulCount || 0,
      sentiment: r.sentiment || 'neutral',
    })),
  }

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactForm)
    setIsSubmitted(true)
    setTimeout(() => {
      setShowContactModal(false)
      setShowApplyModal(false)
      setIsSubmitted(false)
      setContactForm({
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredDate: '',
        nationality: '',
        koreanLevel: 'beginner',
        visaType: '',
        visaExpiry: ''
      })
    }, 2000)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-emerald-500" />
      case 'negative': return <Frown className="w-4 h-4 text-rose-500" />
      default: return <Meh className="w-4 h-4 text-amber-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/" className="text-xl font-black text-indigo-600">KNOWGL</Link>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Heart className={cn(
                  'w-5 h-5 transition',
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                )} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <img 
                src={place.image} 
                alt={place.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-semibold rounded-lg">
                  일자리
                </span>
              </div>
            </div>

            {/* Title Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{place.title}</h1>
                  <p className="text-gray-500 text-lg">{place.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-lg">{place.rating}</span>
                  <span className="text-gray-500">({place.totalReviews})</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{place.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  근무시간
                </div>
                <p className="font-semibold text-gray-800">{place.workHours}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <DollarSign className="w-4 h-4" />
                  급여
                </div>
                <p className="font-semibold text-gray-800">시급 12,000원</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Users className="w-4 h-4" />
                  외국인 근무자
                </div>
                <p className="font-semibold text-gray-800">23명</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <ThumbsUp className="w-4 h-4" />
                  추천율
                </div>
                <p className="font-semibold text-gray-800">89%</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold border-b-2 transition flex items-center justify-center gap-2',
                    activeTab === 'ai' 
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Sparkles className="w-5 h-5" />
                  AI 리뷰 요약
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'flex-1 py-4 text-sm font-semibold border-b-2 transition flex items-center justify-center gap-2',
                    activeTab === 'reviews' 
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  )}
                >
                  <MessageCircle className="w-5 h-5" />
                  리뷰 ({place.totalReviews})
                </button>
              </div>

              <div className="p-6">
                {/* AI Summary Tab */}
                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    {/* Radar Chart */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        AI 평가 분석
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={place.radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis 
                              dataKey="category" 
                              tick={{ fill: '#64748b', fontSize: 13 }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 5]} 
                              tick={{ fill: '#94a3b8', fontSize: 11 }}
                            />
                            <Radar
                              name="평점"
                              dataKey="score"
                              stroke="#6366f1"
                              fill="#6366f1"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Score Legend */}
                      <div className="grid grid-cols-6 gap-4 mt-4">
                        {place.radarData.map((item, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-sm text-gray-500">{item.category}</div>
                            <div className="font-bold text-indigo-600 text-lg">{item.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Summary Text */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        AI 요약
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {place.aiSummary.summary}
                      </p>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Positive */}
                      <div className="bg-emerald-50 rounded-2xl p-6">
                        <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5" />
                          장점
                        </h4>
                        <ul className="space-y-3">
                          {place.aiSummary.positive.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-emerald-800">
                              <span className="text-emerald-500 mt-0.5 font-bold">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Negative */}
                      <div className="bg-rose-50 rounded-2xl p-6">
                        <h4 className="font-bold text-rose-700 mb-4 flex items-center gap-2">
                          <ThumbsDown className="w-5 h-5" />
                          단점
                        </h4>
                        <ul className="space-y-3">
                          {place.aiSummary.negative.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-rose-800">
                              <span className="text-rose-500 mt-0.5 font-bold">✗</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Review Stats */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-gray-900">{place.rating}</div>
                        <div>
                          <div className="flex mb-1">
                            {[1,2,3,4,5].map(i => (
                              <Star 
                                key={i} 
                                className={cn(
                                  'w-5 h-5',
                                  i <= Math.round(Number(place.rating)) 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'fill-gray-200 text-gray-200'
                                )} 
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">{place.totalReviews}개 리뷰</div>
                        </div>
                      </div>
                      <Link 
                        href={`/place/${params.id}/review`}
                        className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
                      >
                        리뷰 작성
                      </Link>
                    </div>

                    {/* Review Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Rating Filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">별점:</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setReviewFilter('all')}
                            className={cn(
                              'px-3 py-1.5 text-sm rounded-lg transition',
                              reviewFilter === 'all'
                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                          >
                            전체
                          </button>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewFilter(rating as 5|4|3|2|1)}
                              className={cn(
                                'px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1',
                                reviewFilter === rating
                                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              )}
                            >
                              {rating}<Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sort Filter */}
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-500">정렬:</span>
                        <select
                          value={reviewSort}
                          onChange={(e) => setReviewSort(e.target.value as 'latest' | 'helpful')}
                          className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg border-none outline-none cursor-pointer"
                        >
                          <option value="latest">최신순</option>
                          <option value="helpful">추천순</option>
                        </select>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                      {place.reviews
                        .filter(review => reviewFilter === 'all' || review.rating === reviewFilter)
                        .sort((a, b) => {
                          if (reviewSort === 'helpful') return b.helpful - a.helpful
                          return 0 // 기본 최신순 (이미 정렬됨)
                        }).length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>해당 조건의 리뷰가 없습니다.</p>
                        </div>
                      ) : place.reviews
                        .filter(review => reviewFilter === 'all' || review.rating === reviewFilter)
                        .sort((a, b) => {
                          if (reviewSort === 'helpful') return b.helpful - a.helpful
                          return 0 // 기본 최신순 (이미 정렬됨)
                        })
                        .map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-xl p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                {review.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{review.author}</div>
                                <div className="text-sm text-gray-500">{review.country} - {review.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(review.sentiment)}
                              <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                  <Star 
                                    key={i} 
                                    className={cn(
                                      'w-4 h-4',
                                      i <= review.rating 
                                        ? 'fill-amber-400 text-amber-400' 
                                        : 'fill-gray-200 text-gray-200'
                                    )} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-3">
                            {review.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleReviewReaction(review.id, 'like')}
                              disabled={reviewReactions[review.id] === 'dislike'}
                              className={cn(
                                'flex items-center gap-2 text-sm transition btn-press',
                                reviewReactions[review.id] === 'like' 
                                  ? 'text-green-600 font-semibold' 
                                  : reviewReactions[review.id] === 'dislike'
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-green-600'
                              )}
                            >
                              <ThumbsUp className={cn('w-4 h-4', reviewReactions[review.id] === 'like' && 'fill-green-600')} />
                              {(review.helpful || 0) + (reviewReactions[review.id] === 'like' ? 1 : 0)}
                            </button>
                            <button 
                              onClick={() => handleReviewReaction(review.id, 'dislike')}
                              disabled={reviewReactions[review.id] === 'like'}
                              className={cn(
                                'flex items-center gap-2 text-sm transition btn-press',
                                reviewReactions[review.id] === 'dislike' 
                                  ? 'text-red-500 font-semibold' 
                                  : reviewReactions[review.id] === 'like'
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-red-500'
                              )}
                            >
                              <ThumbsDown className={cn('w-4 h-4', reviewReactions[review.id] === 'dislike' && 'fill-red-500')} />
                              {reviewReactions[review.id] === 'dislike' ? 1 : 0}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More */}
                    <button className="w-full py-4 text-center text-indigo-600 font-medium flex items-center justify-center gap-2 hover:bg-indigo-50 rounded-lg transition">
                      더 많은 리뷰 보기
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - CTA Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">시급 12,000원</div>
                <p className="text-gray-500">바리스타</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{place.workHours}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{place.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>외국인 23명 근무 중</span>
                </div>
              </div>

              <button 
                onClick={() => setShowApplyModal(true)}
                className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition mb-3"
              >
                지원하기
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full py-4 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                문의하기
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">외국인 만족도</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">추천율</span>
                  <span className="font-semibold text-emerald-600">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal - 문의하기 */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {!isSubmitted ? (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">문의하기</h2>
                    <p className="text-sm text-gray-500 mt-1">{place.title}에 문의를 보내세요</p>
                  </div>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="이름을 입력하세요"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">문의 내용</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="궁금한 점을 자유롭게 작성해주세요"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleContactSubmit}
                    disabled={!contactForm.name || !contactForm.phone || !contactForm.message}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    문의 보내기
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">문의가 전송되었습니다!</h3>
                <p className="text-gray-500">담당자가 확인 후 연락드릴 예정입니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal - 지원하기 */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {!isSubmitted ? (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">지원하기</h2>
                    <p className="text-sm text-gray-500 mt-1">{place.title} - {place.subtitle}</p>
                  </div>
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 text-indigo-700">
                      <Briefcase className="w-5 h-5" />
                      <span className="font-medium">외국인 직원 채용 중</span>
                    </div>
                    <p className="text-sm text-indigo-600 mt-2">이 매장은 외국인 직원 채용에 적극적입니다. 한국어가 서툴러도 지원 가능합니다.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름 (Name)</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="이름을 입력하세요"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">연락처 (Phone)</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="010-0000-0000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">국적 (Nationality)</label>
                      <select
                        value={contactForm.nationality}
                        onChange={(e) => setContactForm({...contactForm, nationality: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="">선택하세요</option>
                        <option value="US">미국 (USA)</option>
                        <option value="JP">일본 (Japan)</option>
                        <option value="CN">중국 (China)</option>
                        <option value="VN">베트남 (Vietnam)</option>
                        <option value="TH">태국 (Thailand)</option>
                        <option value="PH">필리핀 (Philippines)</option>
                        <option value="other">기타 (Other)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일 (Email)</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">비자 종류 (Visa Type)</label>
                      <select
                        value={contactForm.visaType}
                        onChange={(e) => setContactForm({...contactForm, visaType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="">선택하세요</option>
                        <option value="E-9">E-9 (비전문취업)</option>
                        <option value="E-7">E-7 (특정활동)</option>
                        <option value="H-2">H-2 (방문취업)</option>
                        <option value="F-4">F-4 (재외동포)</option>
                        <option value="F-5">F-5 (영주권)</option>
                        <option value="F-6">F-6 (결혼이민)</option>
                        <option value="D-10">D-10 (구직)</option>
                        <option value="D-4">D-4 (유학)</option>
                        <option value="working-holiday">워킹홀리데이</option>
                        <option value="other">기타 (Other)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">비자 만료일 (Visa Expiry)</label>
                      <input
                        type="date"
                        value={contactForm.visaExpiry}
                        onChange={(e) => setContactForm({...contactForm, visaExpiry: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">한국어 수준 (Korean Level)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'beginner', label: '초급', desc: 'Beginner' },
                        { value: 'intermediate', label: '중급', desc: 'Intermediate' },
                        { value: 'advanced', label: '고급', desc: 'Advanced' }
                      ].map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setContactForm({...contactForm, koreanLevel: level.value})}
                          className={cn(
                            'py-3 px-4 rounded-xl border-2 transition text-center',
                            contactForm.koreanLevel === level.value
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">희망 근무 시작일</label>
                    <input
                      type="date"
                      value={contactForm.preferredDate}
                      onChange={(e) => setContactForm({...contactForm, preferredDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">자기소개 (Introduction)</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="간단한 자기소개와 지원 동기를 작성해주세요"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleContactSubmit}
                    disabled={!contactForm.name || !contactForm.phone || !contactForm.nationality}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    지원서 제출하기
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    제출된 정보는 채용 목적으로만 사용됩니다
                  </p>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">지원이 완료되었습니다!</h3>
                <p className="text-gray-500">매장에서 검토 후 연락드릴 예정입니다.</p>
                <p className="text-sm text-gray-400 mt-2">보통 3-5일 내에 연락을 받으실 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
