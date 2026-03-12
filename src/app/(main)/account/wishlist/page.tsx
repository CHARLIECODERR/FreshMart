'use client'

import React from 'react'
import ProductGrid from '@/components/product/ProductGrid'
import { useWishlistStore } from '@/contexts/useWishlistStore'
import { Product } from '@/types'
import { Heart } from 'lucide-react'
import Link from 'next/link'

// Quick dummy data for visual representation of wishlist logic
const dummyWishlistedProducts: Product[] = [
    {
        id: 'p1',
        name: 'Fresh Organic Tomatoes (Local)',
        slug: 'fresh-tomatoes',
        price: 45,
        unit: '1 kg',
        stock_qty: 50,
        is_active: true,
        category_id: 'vegetables',
        mrp: 60,
        images: [{ id: '1', product_id: 'p1', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&fit=crop', display_order: 1, is_primary: true }]
    },
    {
        id: 'p3',
        name: 'Ashirvaad Whole Wheat Atta',
        slug: 'ashirvaad-atta',
        price: 260,
        unit: '5 kg',
        stock_qty: 15,
        is_active: true,
        category_id: 'staples',
        mrp: 295,
        images: [{ id: '3', product_id: 'p3', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop', display_order: 1, is_primary: true }]
    }
]

export default function WishlistPage() {
    const { productIds } = useWishlistStore()

    // In real implementation, we'd fetch actual products by IDs stored in wishlist
    // For demo: Use dummy data if their IDs vaguely match, otherwise empty
    const displayItems = productIds.length > 0 ? dummyWishlistedProducts : []

    return (
        <div className="animate-fade-in -mx-4 md:mx-0">
            <div className="px-4 md:px-0 mb-6 flex items-center justify-between">
                <h2 className="font-bold text-xl text-gray-900">My Wishlist</h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {productIds.length} Items
                </span>
            </div>

            {productIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl mx-4 md:mx-0 shadow-sm border border-gray-100 py-16">
                    <div className="w-20 h-20 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-4">
                        <Heart size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 text-sm max-w-sm mb-6">
                        Save items you like to your wishlist so you can quickly find and buy them later.
                    </p>
                    <Link href="/shop" className="btn-primary px-8">
                        Explore Products
                    </Link>
                </div>
            ) : (
                <ProductGrid products={displayItems} columns="3" />
            )}
        </div>
    )
}
