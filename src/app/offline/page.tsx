'use client'

import React from 'react'
import { WifiOff, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400 border-4 border-white shadow-sm">
                <WifiOff size={40} />
            </div>

            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">You're Offline</h1>

            <p className="text-gray-500 max-w-sm mb-8">
                It looks like you've lost your internet connection. Some parts of FreshMart are still accessible, but you can't browse new products or place orders right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={18} /> Try Again
                </button>

                <Link href="/cart" className="btn-outline w-full bg-white text-center">
                    View Cart
                </Link>
            </div>
        </div>
    )
}
