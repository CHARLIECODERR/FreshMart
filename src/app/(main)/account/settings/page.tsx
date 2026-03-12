'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function SettingsPage() {
    const { profile, updateProfile, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(false)

    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [phone, setPhone] = useState(profile?.phone || '')
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updateProfile({
                full_name: fullName,
                phone: phone,
                avatar_url: avatarUrl
            })
            toast.success('Profile updated successfully')
        } catch (error: any) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="animate-fade-in max-w-2xl pb-10">
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Account Settings</h2>
            <p className="text-gray-500 mb-8 text-sm">Update your personal information and profile picture.</p>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile Photo Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 overflow-hidden border-2 border-primary-50 ring-4 ring-primary-50/30 shrink-0">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold">{fullName.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-800 mb-1.5 ml-1">Profile Photo URL</label>
                        <input
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-2 ml-1">Paste an image link to update your avatar.</p>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">👤</div>
                        Personal Information
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1.5 ml-1">Email (Verified)</label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed italic"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-1.5 ml-1">Phone Number (10 digits)</label>
                            <input
                                type="tel"
                                pattern="[0-9]{10}"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto btn-primary px-10 py-3.5 shadow-lg shadow-primary-500/20"
                        >
                            {loading ? 'Saving Changes...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
