import { create } from 'zustand'
import { Profile } from '@/types'

export interface AuthStore {
    user: any | null
    profile: Profile | null
    isLoading: boolean
    setUser: (user: any | null) => void
    setProfile: (profile: Profile | null) => void
    setLoading: (loading: boolean) => void
    clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    profile: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (isLoading) => set({ isLoading }),
    clear: () => set({ user: null, profile: null }),
}))
