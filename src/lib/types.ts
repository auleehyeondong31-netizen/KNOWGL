// 공통 타입 정의

export interface MarketItem {
  id: number
  title: string
  category: string
  price: number
  rating: number
  reviews: number
  views: number
  likes: number
  seller: string
  thumbnail: string
  description: string
}

export interface CommunityPost {
  id: number | string
  title: string
  category: string
  content: string
  author: string
  authorCountry: string
  likes: number
  dislikes?: number
  comments: number
  views: number
  createdAt: string
  isPinned?: boolean
  isFromDB?: boolean
}

export interface Category {
  id: string
  name: string
  nameEn?: string
  icon?: any
}

export type PlaceType = 'job' | 'housing' | 'amenity'

export interface Place {
  id: string | number
  title: string
  subtitle: string
  type: PlaceType
  category: string
  location: string
  image: string
  rating: number
  reviews: number
  tags: string[]
  shortReview?: string
  country?: string
}
