'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { getCountryByCode } from '@/lib/countries'

interface CountryHeaderProps {
  countryCode: string
  title: string
  titleEn: string
  gradientFrom: string
  gradientTo: string
  isKorean: boolean
}

export function CountryHeader({ 
  countryCode, 
  title, 
  titleEn, 
  gradientFrom, 
  gradientTo, 
  isKorean 
}: CountryHeaderProps) {
  const country = getCountryByCode(countryCode)
  
  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country?.flag}</span>
            <h1 className="text-xl font-bold">
              {isKorean ? `${country?.name} ${title}` : `${country?.nameEn} ${titleEn}`}
            </h1>
          </div>
          <Link
            href="/country"
            className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-sm"
          >
            <Globe className="w-4 h-4" />
            {isKorean ? '국가 변경' : 'Change Country'}
          </Link>
        </div>
      </div>
    </div>
  )
}
