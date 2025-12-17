import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 런타임에 환경 변수 사용
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // 서버 사이드 빌드 시점에는 더미 클라이언트 반환
    if (typeof window === 'undefined') {
      return createClient('https://placeholder.supabase.co', 'placeholder-key')
    }
    console.error('Supabase credentials not found')
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase: SupabaseClient = getSupabaseClient()

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          name: string | null
          avatar_url: string | null
          nationality: string | null
          language: string
          destination: string | null
          is_premium: boolean
          visa_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          name?: string | null
          avatar_url?: string | null
          nationality?: string | null
          language?: string
          destination?: string | null
          is_premium?: boolean
          visa_expiry?: string | null
        }
        Update: {
          email?: string | null
          phone?: string | null
          name?: string | null
          avatar_url?: string | null
          nationality?: string | null
          language?: string
          destination?: string | null
          is_premium?: boolean
          visa_expiry?: string | null
        }
      }
      places: {
        Row: {
          id: string
          type: 'job' | 'housing' | 'amenity'
          name: string
          category: string
          subtitle: string | null
          description: string | null
          short_review: string | null
          address: string
          location: string | null
          lat: number
          lng: number
          image_url: string | null
          tags: string[]
          avg_rating: number
          review_count: number
          // Job-specific
          work_hours: string | null
          benefits: string[] | null
          // Housing-specific
          deposit: string | null
          size: string | null
          created_at: string
        }
        Insert: {
          type: 'job' | 'housing' | 'amenity'
          name: string
          category: string
          subtitle?: string | null
          description?: string | null
          short_review?: string | null
          address: string
          location?: string | null
          lat: number
          lng: number
          image_url?: string | null
          tags?: string[]
          work_hours?: string | null
          benefits?: string[] | null
          deposit?: string | null
          size?: string | null
        }
        Update: {
          name?: string
          category?: string
          subtitle?: string | null
          description?: string | null
          short_review?: string | null
          address?: string
          location?: string | null
          lat?: number
          lng?: number
          image_url?: string | null
          tags?: string[]
          work_hours?: string | null
          benefits?: string[] | null
          deposit?: string | null
          size?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          place_id: string
          user_id: string
          rating: number
          rating_details: Record<string, number>
          content: string
          ai_summary: string | null
          helpful_count: number
          author_name: string | null
          author_country: string | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          place_id: string
          user_id: string
          rating: number
          rating_details: Record<string, number>
          content: string
          author_name?: string | null
          author_country?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
        }
        Update: {
          rating?: number
          rating_details?: Record<string, number>
          content?: string
          ai_summary?: string | null
          helpful_count?: number
        }
      }
      market_items: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string
          price: number
          category: string
          file_url: string | null
          thumbnail_url: string | null
          rating: number
          sales_count: number
          is_super: boolean
          created_at: string
        }
        Insert: {
          seller_id: string
          title: string
          description: string
          price: number
          category: string
          file_url?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          title?: string
          description?: string
          price?: number
          category?: string
          file_url?: string | null
          thumbnail_url?: string | null
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          category: string
          title: string
          content: string
          comment_count: number
          like_count: number
          created_at: string
        }
        Insert: {
          user_id: string
          category: string
          title: string
          content: string
        }
        Update: {
          category?: string
          title?: string
          content?: string
        }
      }
    }
  }
}
