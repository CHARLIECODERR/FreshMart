import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthProvider'
import { auth, db } from '@/lib/firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile as updateFirebaseAuthProfile,
    GoogleAuthProvider,
    signInWithPopup,
    getAdditionalUserInfo,
    sendEmailVerification
} from 'firebase/auth'
import { UserProfile, Address } from '@/types'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const googleProvider = new GoogleAuthProvider()

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user
        const additionalInfo = getAdditionalUserInfo(result)

        // If new user, create profile in firestore
        if (additionalInfo?.isNewUser) {
            await setDoc(doc(db, 'users', user.uid), {
                full_name: user.displayName,
                email: user.email,
                role: 'customer',
                avatar_url: user.photoURL,
                created_at: new Date().toISOString()
            })
        }

        await context.refreshProfile()
        return user
    }

    const signup = async (email: string, pass: string, fullName: string, phone: string) => {
        const { user } = await createUserWithEmailAndPassword(auth, email, pass)
        // Set display name in auth
        await updateFirebaseAuthProfile(user, { displayName: fullName })

        // Create user document in firestore
        await setDoc(doc(db, 'users', user.uid), {
            full_name: fullName,
            email: email,
            phone: phone,
            role: 'customer',
            created_at: new Date().toISOString()
        })

        // Send email verification
        await sendEmailVerification(user)

        await context.refreshProfile()
        return user
    }

    const login = async (email: string, pass: string) => {
        const { user } = await signInWithEmailAndPassword(auth, email, pass)
        await context.refreshProfile()
        return user
    }

    const logout = async () => {
        await signOut(auth)
        // Clear session cookies if any (handled by deleteCookie in some setups, 
        // but here we just need to ensure the AuthProvider state resets which it does via onAuthStateChanged)
        window.location.href = '/'
    }

    const forgotPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email)
    }

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!context.user) return
        const userRef = doc(db, 'users', context.user.uid)
        await setDoc(userRef, data, { merge: true })
        await context.refreshProfile()
    }

    const updateAddresses = async (addresses: Address[]) => {
        if (!context.user) return
        const userRef = doc(db, 'users', context.user.uid)
        await setDoc(userRef, { addresses }, { merge: true })
        await context.refreshProfile()
    }

    return {
        user: context.user,
        profile: context.profile,
        loading: context.loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        forgotPassword,
        updateProfile,
        updateAddresses,
        refreshProfile: context.refreshProfile
    }
}
