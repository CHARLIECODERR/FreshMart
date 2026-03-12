'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { storage } from '@/lib/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import toast from 'react-hot-toast'
import UserAvatar from '@/components/common/UserAvatar'
import { Camera, Check, Grid } from 'lucide-react'

const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Snuggles',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Pepper',
]

export default function SettingsPage() {
    const { profile, updateProfile, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [phone, setPhone] = useState(profile?.phone || '')
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !profile) return

        if (!file.type.startsWith('image/')) {
            return toast.error('Please upload an image file')
        }

        setUploading(true)
        const toastId = toast.loading('Uploading photo...')

        try {
            const storageRef = ref(storage, `profiles/${profile.uid}/${Date.now()}_${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadUrl = await getDownloadURL(storageRef)
            setAvatarUrl(downloadUrl)
            toast.success('Photo uploaded! Save changes to apply.', { id: toastId })
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error('Upload failed. Please try again.', { id: toastId })
        } finally {
            setUploading(false)
        }
    }

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
            <h2 className="font-bold text-2xl text-gray-900 mb-2 font-display">Account Settings</h2>
            <p className="text-gray-500 mb-8 text-sm">Manage your FreshMart identity and preferences.</p>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile Identity Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar Column */}
                        <div className="relative group">
                            <UserAvatar
                                name={fullName}
                                src={avatarUrl}
                                size="xl"
                                className="ring-8 ring-primary-50/50"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2.5 rounded-2xl shadow-xl hover:bg-primary-700 active:scale-95 transition-all border-4 border-white"
                            >
                                <Camera size={18} className={uploading ? 'animate-pulse' : ''} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Name/Email Column */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{profile?.full_name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{profile?.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-green-100">
                                    Customer
                                </span>
                                {profile?.role === 'admin' && (
                                    <span className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary-100">
                                        Admin Access
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Avatar Selection */}
                    <div className="mt-10 pt-8 border-t border-gray-50">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                            <Grid size={14} />
                            Or Choose a Preset Avatar
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {PRESET_AVATARS.map((url, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setAvatarUrl(url)}
                                    className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-90 ${avatarUrl === url ? 'border-primary-500 ring-4 ring-primary-50' : 'border-gray-100 hover:border-primary-200'
                                        }`}
                                >
                                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                                    {avatarUrl === url && (
                                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                            <div className="bg-primary-500 text-white rounded-full p-0.5">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
                    <h3 className="font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                            👤
                        </div>
                        Personal Information
                    </h3>

                    <div className="grid gap-6">
                        <div className="group">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-sm font-medium transition-all outline-none"
                            />
                        </div>

                        <div className="group opacity-70">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Email</label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm text-gray-500 cursor-not-allowed italic font-medium"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                pattern="[0-9]{10}"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:ring-0 rounded-2xl px-5 py-4 text-sm font-medium transition-all outline-none"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="w-full md:w-auto bg-primary-600 text-white hover:bg-primary-700 font-bold px-12 py-4 rounded-2xl shadow-xl shadow-primary-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
