'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/contexts/useCartStore'

export default function BottomNav() {
    const pathname = usePathname()
    const cartItemCount = useCartStore((state) => state.itemCount())

    // Hide on desktop and specific routes like checkout/login
    const hiddenRoutes = ['/checkout', '/login', '/signup', '/forgot-password']
    if (hiddenRoutes.some(route => pathname?.startsWith(route))) {
        return null
    }

    const navItems = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Search', icon: Search, href: '/search' },
        { label: 'Cart', icon: ShoppingBag, href: '/cart', badge: cartItemCount },
        { label: 'Account', icon: User, href: '/account' },
    ]

    return (
        <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-bottom-nav z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center h-[60px] standalone-padding-bottom">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform"
                        >
                            <div className="relative">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-gray-400'
                                        }`}
                                />

                                {/* Cart Badge */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-gray-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
