'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Store, ShoppingBag, FolderTree, Image as ImageIcon, LogOut, Verified, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import UserAvatar from '@/components/common/UserAvatar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, loading, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading) {
            if (!profile || profile.role !== 'admin') {
                router.push('/')
            }
        }
    }, [profile, loading, router])

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [pathname])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-900">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!profile || profile.role !== 'admin') {
        return null
    }

    const navLinks = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Products', href: '/admin/products', icon: Store },
        { label: 'Categories', href: '/admin/categories', icon: FolderTree },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
    ]

    return (
        <div className="flex h-screen bg-slate-50 font-sans relative overflow-hidden">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-[60] transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-950">
                    <Link href="/admin" className="font-display font-bold text-xl text-white flex items-center gap-2">
                        <Verified size={24} className="text-primary-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-200">
                            FreshMart OS
                        </span>
                    </Link>
                    <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                        Management
                    </div>

                    {navLinks.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm'
                                    : 'hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary-400' : 'text-slate-500'} />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 border border-white/10 mb-2">
                        <UserAvatar
                            name={profile?.full_name}
                            src={profile?.avatar_url}
                            size="sm"
                            className="border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin User'}</p>
                            <p className="text-xs text-slate-400 truncate">Store Manager</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:ml-64 bg-slate-50 w-full overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="font-semibold text-gray-800 text-lg">
                            {navLinks.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                            <span className="hidden sm:inline">Go to Store &rarr;</span>
                            <span className="sm:hidden">Store &rarr;</span>
                        </Link>
                    </div>
                </header>

                {/* Page children */}
                <div className="p-4 lg:p-8 overflow-y-auto w-full h-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    )
}
