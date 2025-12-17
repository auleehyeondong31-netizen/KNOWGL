'use client'

import { useState, useEffect } from 'react'
import { getPlaces, placeToListing, isSupabaseConfigured, PlaceType } from '@/lib/api/places'

export interface Listing {
  id: string | number
  category: string
  title: string
  subtitle: string
  location: string
  rating: number
  reviews: number
  image: string
  shortReview: string
  tags: string[]
  workHours?: string
  benefits?: string[]
  deposit?: string
  size?: string
}

interface UsePlacesOptions {
  type: PlaceType
  category?: string
  location?: string
  country?: string
}

export function usePlaces({ type, category, location, country }: UsePlacesOptions) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [isFromSupabase, setIsFromSupabase] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      setLoading(true)
      
      // Supabase에서 데이터 가져오기
      if (isSupabaseConfigured()) {
        try {
          const places = await getPlaces({ type, category, location, country })
          if (mounted) {
            setListings(places.map(placeToListing))
            setIsFromSupabase(true)
          }
        } catch (error) {
          console.warn('Supabase fetch failed:', error)
          if (mounted) {
            setListings([])
          }
        }
      } else {
        if (mounted) {
          setListings([])
        }
      }
      
      if (mounted) {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [type, category, location, country])

  return { listings, loading, isFromSupabase }
}
