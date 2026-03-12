'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Footer from './Footer'
import InstallPrompt from '../pwa/InstallPrompt'
import AnnouncementBar from '../home/AnnouncementBar'
import { usePathname } from 'next/navigation'

interface AppShellProps {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // If Admin route, don't show the main app layout elements
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-slate-50 w-full overflow-hidden">
                {children}
            </div>
        )
    }

    return (
        <div className="relative flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden md:max-w-full md:shadow-none md:bg-slate-50">
            {/* Top Fixed Section */}
            <div className="fixed top-0 w-full z-50 md:max-w-7xl md:left-1/2 md:-translate-x-1/2">
                <AnnouncementBar />
                <Header />
            </div>

            {/* Main Scrollable Content Area */}
            <main className="flex-1 w-full pb-[80px] pt-[96px] md:pt-[112px] md:pb-0 overflow-y-auto no-scrollbar md:max-w-7xl md:mx-auto">
                <div className="min-h-screen">
                    {children}
                </div>
                {/* Desktop Global Footer */}
                <Footer />
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav />

            {/* PWA Install Prompt Banner */}
            <InstallPrompt />
        </div>
    )
}
