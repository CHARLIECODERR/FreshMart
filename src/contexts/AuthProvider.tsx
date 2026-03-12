'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { setCookie, deleteCookie } from 'cookies-next'
import { UserProfile } from '@/types'

interface AuthContextType {
    user: FirebaseUser | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    refreshProfile: async () => { },
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setProfile({
                    id: docSnap.id,
                    full_name: data.full_name || 'User',
                    email: data.email || '',
                    role: data.role || 'customer',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || '',
                    addresses: data.addresses || [],
                    created_at: data.created_at || new Date().toISOString()
                } as UserProfile)
            } else {
                setProfile({
                    id: uid,
                    full_name: 'Guest User',
                    email: '',
                    role: 'customer',
                    addresses: [],
                    created_at: new Date().toISOString()
                } as UserProfile)
            }
        } catch (err) {
            console.error('Error fetching profile', err)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)
            if (firebaseUser) {
                // Set a cookie for middleware to read
                const token = await firebaseUser.getIdToken()
                setCookie('firebaseAuthToken', token, { maxAge: 60 * 60 * 24 * 7, path: '/' })

                await fetchProfile(firebaseUser.uid)
            } else {
                deleteCookie('firebaseAuthToken')
                setProfile(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.uid)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}
