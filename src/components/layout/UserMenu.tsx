'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, LogOut, Settings, ShoppingBag, MapPin, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import UserAvatar from '../common/UserAvatar'

export default function UserMenu() {
    const { profile, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!profile) {
        return (
            <Link href="/login" className="btn-primary py-2 px-5 text-sm">
                Login
            </Link>
        )
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <UserAvatar
                    name={profile.full_name}
                    src={profile.avatar_url}
                    size="sm"
                />
                <span className="hidden md:block text-sm font-semibold text-slate-700 pr-1">
                    {profile.full_name.split(' ')[0]}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{profile.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                    </div>

                    {/* Profile Link */}
                    <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                    >
                        <User size={16} className="text-slate-400" />
                        My Profile
                    </Link>

                    {/* Common Links Group */}
                    <div className="py-1">
                        <Link
                            href="/account/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <ShoppingBag size={16} className="text-slate-400" />
                            My Orders
                        </Link>
                        <Link
                            href="/account/addresses"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <MapPin size={16} className="text-slate-400" />
                            Saved Addresses
                        </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-50">
                        {profile.role === 'admin' && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 font-bold hover:bg-primary-50 transition-colors mb-1"
                            >
                                <LayoutDashboard size={16} className="text-primary-500" />
                                Admin Panel
                            </Link>
                        )}
                        <Link
                            href="/account/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Settings size={16} className="text-slate-400" />
                            Settings
                        </Link>
                        <button
                            onClick={() => {
                                logout()
                                setIsOpen(false)
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 w-full text-left transition-colors font-bold mt-1"
                        >
                            <LogOut size={16} className="text-rose-400" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
