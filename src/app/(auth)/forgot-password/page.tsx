'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return toast.error('Please enter your email')

        setLoading(true)
        try {
            await forgotPassword(email)
            setSuccess(true)
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset link')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center pt-24 p-4 text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-3xl text-primary-500">
                    🔑
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Check your inbox</h1>
                <p className="text-gray-500 max-w-sm mb-8">
                    If an account exists for <b>{email}</b>, you will receive a password reset link shortly.
                </p>
                <Link href="/login" className="btn-outline px-8 py-3 bg-white">
                    Return to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 mb-8 mt-12">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleReset} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 mt-2 flex justify-center text-sm shadow-md"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    Remembered your password?{' '}
                    <Link href="/login" className="text-primary-600 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
