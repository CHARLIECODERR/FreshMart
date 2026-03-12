import React from 'react'
import BannerCarousel from '@/components/home/BannerCarousel'
import CategoryStrip from '@/components/home/CategoryStrip'
import ProductGrid from '@/components/product/ProductGrid'
import { ShieldCheck, Truck, Clock, Store } from 'lucide-react'
import { getCategories, getFeaturedProducts } from '@/lib/services/catalogService'

export default async function Home() {
    const [categories, featuredProducts] = await Promise.all([
        getCategories(),
        getFeaturedProducts()
    ])

    const hasData = categories.length > 0 || featuredProducts.length > 0

    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* 1. Main Promotional Banners */}
            <BannerCarousel />

            {/* 2. Category Navigation */}
            <CategoryStrip categories={categories} />

            {/* 3. Featured Products */}
            {featuredProducts.length > 0 && (
                <ProductGrid
                    title="Featured for You"
                    products={featuredProducts}
                    viewAllLink="/shop"
                />
            )}

            {/* 4. Empty State (Only if no data at all) */}
            {!hasData && (
                <div className="mx-4 my-10 bg-white rounded-2xl p-10 border border-slate-200 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                        <Store size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to FreshMart!</h2>
                    <p className="text-slate-500 text-sm max-w-sm">
                        Admin: Please log into the Admin panel (`/admin`) to add real products and categories to your store via Firestore.
                    </p>
                </div>
            )}

            {/* 4. Trust Banner Strip */}
            <div className="mx-4 mb-10 bg-green-50 rounded-2xl p-4 md:p-6 border border-green-100/50">
                <div className="grid grid-cols-3 gap-2 md:gap-6 divide-x divide-green-200/60">
                    <div className="flex flex-col items-center text-center px-1">
                        <Truck className="text-primary-600 mb-2" size={24} />
                        <span className="text-xs md:text-sm font-semibold text-gray-800">Free Delivery</span>
                        <span className="text-[10px] md:text-xs text-gray-500 mt-0.5">Orders ₹499+</span>
                    </div>
                    <div className="flex flex-col items-center text-center px-1">
                        <ShieldCheck className="text-primary-600 mb-2" size={24} />
                        <span className="text-xs md:text-sm font-semibold text-gray-800">100% Secure</span>
                        <span className="text-[10px] md:text-xs text-gray-500 mt-0.5">Safe payments</span>
                    </div>
                    <div className="flex flex-col items-center text-center px-1">
                        <Clock className="text-primary-600 mb-2" size={24} />
                        <span className="text-xs md:text-sm font-semibold text-gray-800">Fast Delivery</span>
                        <span className="text-[10px] md:text-xs text-gray-500 mt-0.5">Same day service</span>
                    </div>
                </div>
            </div>

            {/* Spacer for bottom nav on mobile */}
            <div className="h-[20px] md:h-0" />
        </div>
    )
}
