'use client'

import React, { useEffect, useState } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import Footer from './Footer'
import InstallPrompt from '../pwa/InstallPrompt'

interface AppShellProps {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="relative flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden md:max-w-full md:shadow-none md:bg-slate-50">
            {/* Desktop/Web Header */}
            <Header />

            {/* Main Scrollable Content Area */}
            <main className="flex-1 w-full pb-[80px] pt-[60px] md:pt-[72px] md:pb-0 overflow-y-auto no-scrollbar md:max-w-7xl md:mx-auto">
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
