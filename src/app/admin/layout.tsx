'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, ShoppingBag, FolderTree, Image as ImageIcon, LogOut, Verified } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, loading, logout } = useAuth()

    useEffect(() => {
        if (!loading) {
            if (!profile || profile.role !== 'admin') {
                router.push('/')
            }
        }
    }, [profile, loading, router])

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
        <div className="flex h-screen bg-slate-50 font-sans">

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-white/10 bg-slate-950">
                    <Link href="/admin" className="font-display font-bold text-xl text-white flex items-center gap-2">
                        <Verified size={24} className="text-primary-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-200">
                            FreshMart OS
                        </span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                        Management
                    </div>

                    {navLinks.map((item) => {
                        // Active if exact match or if inside the path (e.g. /admin/products/new is under /admin/products)
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
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                            {profile?.full_name?.charAt(0) || 'A'}
                        </div>
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
            <main className="flex-1 flex flex-col ml-64 bg-slate-50">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <h1 className="font-semibold text-gray-800 text-lg">
                        {navLinks.find(n => pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                            Go to Storefeed &rarr;
                        </Link>
                    </div>
                </header>

                {/* Page children */}
                <div className="p-8 overflow-y-auto w-full h-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    )
}
