import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string | null
  name: string | null
  avatar_url: string | null
  nationality: string | null
  language: string
  destination: string | null
  is_premium: boolean
  visa_expiry: string | null
}

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  
  language: string
  setLanguage: (lang: string) => void
  
  mapMode: 'job' | 'housing' | 'amenity'
  setMapMode: (mode: 'job' | 'housing' | 'amenity') => void
  
  isOnboarded: boolean
  setOnboarded: (value: boolean) => void
  
  onboardingData: {
    nationality: string | null
    language: string | null
    destination: string | null
  }
  setOnboardingData: (data: Partial<AppState['onboardingData']>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      language: 'ko',
      setLanguage: (language) => set({ language }),
      
      mapMode: 'job',
      setMapMode: (mapMode) => set({ mapMode }),
      
      isOnboarded: false,
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      
      onboardingData: {
        nationality: null,
        language: null,
        destination: null,
      },
      setOnboardingData: (data) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        })),
    }),
    {
      name: 'knowgl-storage',
      partialize: (state) => ({
        language: state.language,
        isOnboarded: state.isOnboarded,
        onboardingData: state.onboardingData,
      }),
    }
  )
)
