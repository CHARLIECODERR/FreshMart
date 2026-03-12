'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/contexts/useCartStore'
import { useAuth } from '@/hooks/useAuth'
import UserMenu from './UserMenu'
import BackButton from '../common/BackButton'

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const cartItemCount = useCartStore((state) => state.itemCount())
    const { user } = useAuth()

    // Subtle shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`transition-all duration-300 w-full ${isScrolled ? 'glass-effect shadow-sm' : 'bg-white'
                }`}
        >
            <div className="flex items-center justify-between px-4 h-[60px] md:h-[72px] md:px-8 max-w-7xl mx-auto">

                {/* Left: Back + Logo */}
                <div className="flex items-center gap-3">
                    <BackButton />
                    <div className="flex flex-col">
                        <Link href="/" className="flex items-center gap-1 active:opacity-70">
                            <span className="text-xl md:text-2xl font-display font-bold text-primary-600 tracking-tight">
                                FreshMart<span className="text-accent-500">.</span>
                            </span>
                        </Link>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5 md:hidden">
                            <MapPin size={12} className="mr-1 text-primary-500" />
                            <span className="truncate max-w-[120px]">Delivering to Home</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Search (Hidden on Mobile) */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <input
                        type="text"
                        placeholder="Search for groceries, fruits..."
                        className="w-full bg-gray-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-full py-2.5 pl-4 pr-10 text-sm transition-all shadow-inner"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                        <Search size={18} />
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href="/search" className="md:hidden text-gray-600 p-2 -mr-2 active:bg-gray-100 rounded-full transition-colors">
                        <Search size={22} />
                    </Link>

                    <div className="hidden md:block">
                        <UserMenu />
                    </div>

                    <Link href="/cart" className="relative p-2 -mr-2 active:bg-gray-100 rounded-full transition-colors group">
                        <ShoppingBag size={24} className="text-gray-700 group-hover:text-primary-600 transition-colors" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-1 right-1 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    )
}
