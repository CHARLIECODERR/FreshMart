'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { login, loginWithGoogle } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return toast.error('Please enter email and password')

        setLoading(true)
        try {
            await login(email, password)
            toast.success('Successfully logged in!')
            router.refresh()
            router.push('/')
        } catch (error: any) {
            toast.error(error.message || 'Login failed', { id: 'auth-error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 mb-8 mt-12">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-2xl font-display font-bold text-primary-600 mb-2">
                        FreshMart<span className="text-accent-500">.</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to sync your cart and orders</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 mt-2 flex justify-center text-sm"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary-600 font-bold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}
