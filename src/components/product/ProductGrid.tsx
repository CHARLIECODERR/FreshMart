'use client'

import React from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Skeleton loaders for suspense/fetching states
export function SkeletonCard() {
    return (
        <div className="card-premium flex flex-col relative w-full h-[280px] md:h-[320px] animate-pulse">
            <div className="relative aspect-[4/3] w-full bg-gray-200" />
            <div className="p-3 flex flex-col flex-1 gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-1" />
                <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 h-10 bg-gray-200 rounded-xl" />
        </div>
    )
}

interface ProductGridProps {
    title?: string
    viewAllLink?: string
    products: Product[]
    isLoading?: boolean
    columns?: '2' | '3' | '4'
}

export default function ProductGrid({
    title,
    viewAllLink,
    products,
    isLoading = false,
    columns = '2' // Mobile default makes it 2
}: ProductGridProps) {

    // Responsive grid classes based on requested columns for desktop
    const gridClasses = {
        '2': 'grid-cols-2 lg:grid-cols-4',
        '3': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
        '4': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    }[columns]

    return (
        <div className="w-full px-4 mb-10">
            {/* Header */}
            {(title || viewAllLink) && (
                <div className="flex items-end justify-between pb-4">
                    {title && (
                        <h3 className="font-display font-bold text-lg md:text-2xl text-gray-900 tracking-tight">
                            {title}
                        </h3>
                    )}
                    {viewAllLink && (
                        <Link href={viewAllLink} className="text-primary-600 text-xs md:text-sm font-semibold flex items-center hover:text-primary-700">
                            See All <ArrowRight size={14} className="ml-1" />
                        </Link>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className={`grid ${gridClasses} gap-3 md:gap-4 lg:gap-5`}>
                {isLoading ? (
                    // Show 4 skeletons while loading
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                ) : products.length > 0 ? (
                    products.map((product, idx) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            priority={idx < 2} // Preload first two images
                        />
                    ))
                ) : (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No products found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
