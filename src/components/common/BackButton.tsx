'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
    className?: string
}

export default function BackButton({ className = '' }: BackButtonProps) {
    const router = useRouter()
    const pathname = usePathname()

    // Don't show on the main home page
    if (pathname === '/') return null

    return (
        <button
            onClick={() => router.back()}
            className={`flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 shadow-sm ${className}`}
            aria-label="Go back"
        >
            <ChevronLeft size={20} />
        </button>
    )
}
