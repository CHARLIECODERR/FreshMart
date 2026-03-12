'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { profile, logout } = useAuth()

    const navItems = [
        { label: 'Overview', href: '/account', icon: User },
        { label: 'My Orders', href: '/account/orders', icon: Package },
        { label: 'Addresses', href: '/account/addresses', icon: MapPin },
        { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
        { label: 'Settings', href: '/account/settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-background pt-4 pb-24 md:pb-12 max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 mt-6">
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky md:top-24">
                        <div className="hidden md:flex flex-col items-center p-6 border-b border-gray-100 bg-gray-50">
                            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl border-4 border-white shadow-sm mb-3">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </div>
                            <h2 className="font-bold text-gray-900 text-center">{profile?.full_name || 'My Account'}</h2>
                        </div>

                        <nav className="flex flex-col py-2">
                            {navItems.map(item => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                                        {item.label}
                                    </Link>
                                )
                            })}

                            <hr className="my-2 border-gray-100 mx-5" />

                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-l-4 border-transparent"
                            >
                                <LogOut size={18} className="text-red-500" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
