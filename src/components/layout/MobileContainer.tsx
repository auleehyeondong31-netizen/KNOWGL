'use client'

import { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface MobileContainerProps {
  children: ReactNode
  showNav?: boolean
}

export function MobileContainer({ children, showNav = true }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen relative shadow-2xl">
        <main className={showNav ? 'pb-24' : ''}>{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  )
}
