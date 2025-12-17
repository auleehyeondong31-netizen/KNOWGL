import { supabase, Database } from '../supabase'

export type Review = Database['public']['Tables']['reviews']['Row']

// 리뷰 목록 가져오기
export async function getReviewsByPlaceId(placeId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data as Review[]
}

// 리뷰 작성
export async function createReview(review: {
  place_id: string
  user_id: string
  rating: number
  rating_details: Record<string, number>
  content: string
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    return null
  }

  return data as Review
}

// 리뷰 수정
export async function updateReview(id: string, updates: {
  rating?: number
  rating_details?: Record<string, number>
  content?: string
}) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating review:', error)
    return null
  }

  return data as Review
}

// 리뷰 삭제
export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting review:', error)
    return false
  }

  return true
}
