'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, MailCheck } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const { signup, loginWithGoogle } = useAuth()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            await loginWithGoogle()
            toast.success('Signed in with Google!')
            router.refresh()
            router.push('/')
        } catch (error: any) {
            toast.error(error.message || 'Google Sign-in failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password || !fullName || !phone) return toast.error('Please fill all fields')
        if (password.length < 6) return toast.error('Password must be at least 6 characters')
        if (phone.length < 10) return toast.error('Please enter a valid 10-digit phone number')

        setLoading(true)

        try {
            await signup(email, password, fullName, phone)
            setSuccess(true)
            toast.success('Account created successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Signup failed', { id: 'signup-error' })
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center pt-24 p-4 text-center animate-fade-in">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-primary-500 shadow-sm border border-primary-100">
                    <MailCheck size={40} />
                </div>
                <h1 className="text-3xl font-display font-black text-gray-900 mb-4 tracking-tight">Verify Your Email</h1>
                <p className="text-gray-500 max-w-sm mb-10 text-base leading-relaxed">
                    Welcome to <b>FreshMart</b>, {fullName}! We've sent a verification link to <b>{email}</b>.
                    Please check your inbox to activate your account.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Link href="/login" className="btn-primary w-full py-4 text-base shadow-xl shadow-primary-500/20">
                        Continue to Login
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-slate-500 font-bold hover:text-primary-600 transition-colors py-2 text-sm"
                    >
                        Didn't receive? Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 mb-8 mt-12">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-2xl font-display font-bold text-primary-600 mb-2">
                        FreshMart<span className="text-accent-500">.</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Start shopping fresh groceries today</p>
                </div>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-xs font-medium uppercase tracking-wider">or email</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                            placeholder="John Doe"
                        />
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            pattern="[0-9]{10}"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                            placeholder="9876543210"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                                placeholder="Min. 6 characters"
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
                        className="w-full btn-primary py-3.5 mt-2 flex justify-center text-sm shadow-md"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
