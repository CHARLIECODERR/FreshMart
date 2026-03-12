'use client'

import React from 'react'
import Image from 'next/image'
import { Plus, Minus, Heart, ArrowLeft, Share2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/contexts/useCartStore'
import { useWishlistStore } from '@/contexts/useWishlistStore'

// Dummy Data
const product = {
    id: 'p1', name: 'Farm Fresh Organic Tomatoes (Local)', slug: 'fresh-tomatoes',
    price: 45, mrp: 60, unit: '1 kg', stock_qty: 50, is_active: true, is_featured: true, created_at: '', category_id: null,
    description: 'Farm fresh red tomatoes packed with vitamins. Directly sourced from local organic farms to ensure quality and freshness.',
    highlights: ['Organic Certified', 'Rich in Vitamin C', 'Farm Fresh'],
    images: [
        { id: '1', product_id: 'p1', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=800&fit=crop', display_order: 1, is_primary: true },
        { id: '2', product_id: 'p1', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop', display_order: 2, is_primary: false }
    ]
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const router = useRouter()
    const { toggle: toggleWishlist, has: isWishlisted } = useWishlistStore()
    const addItem = useCartStore((state) => state.addItem)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQty = useCartStore((state) => state.updateQty)
    const qtyInCart = useCartStore((state) => state.getQty(product.id))

    const wishlisted = isWishlisted(product.id)
    const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-10">

            {/* Mobile Top App Bar (Over image) */}
            <div className="fixed top-0 w-full z-40 flex items-center justify-between p-4 md:hidden bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={() => router.back()} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => toggleWishlist(product.id)} className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                        <Heart size={20} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-white'} />
                    </button>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col md:flex-row md:p-6 lg:p-8 md:gap-8 max-w-6xl mx-auto md:mt-24">

                {/* Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="relative w-full aspect-square bg-white md:rounded-3xl md:shadow-sm overflow-hidden border-b md:border border-gray-100">
                        <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                            priority
                        />
                    </div>
                    {/* Thumbnails (Desktop) */}
                    <div className="hidden md:flex gap-4 mt-4">
                        {product.images.map((img) => (
                            <div key={img.id} className={`w-20 h-20 rounded-xl border-2 overflow-hidden relative cursor-pointer ${img.is_primary ? 'border-primary-600' : 'border-transparent'}`}>
                                <Image src={img.url} alt="thumbnail" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-0 w-full md:w-1/2 flex flex-col">

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-xl md:text-3xl font-display font-bold text-gray-900 leading-snug">
                                {product.name}
                            </h1>
                            <span className="inline-block mt-2 font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {product.unit}
                            </span>
                        </div>
                        {/* Desktop Actions */}
                        <div className="hidden md:flex gap-2">
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors ${wishlisted ? 'bg-red-50 border-red-100' : 'bg-white'}`}
                            >
                                <Heart size={22} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                            </button>
                            <button className="p-2.5 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400">
                                <Share2 size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-4 flex items-end gap-3">
                        <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{product.price}</span>
                        {product.mrp && (
                            <span className="text-lg md:text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
                        )}
                        {discountPercent > 0 && (
                            <span className="bg-accent-50 text-accent-600 font-bold px-2.5 py-1 rounded-lg text-sm mb-1 ml-2 border border-accent-100">
                                {discountPercent}% OFF
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

                    <hr className="my-6 border-gray-100" />

                    {/* Highlights */}
                    {product.highlights && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Why buy this?</h3>
                            <ul className="space-y-2">
                                {product.highlights.map((hlt, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <ShieldCheck size={16} className="text-primary-500" />
                                        {hlt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Product Details</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                </div>
            </div>

            {/* Sticky Bottom Add to Cart Bar */}
            <div className="fixed bottom-0 md:bottom-6 w-full md:max-w-md bg-white border-t border-gray-100 p-4 shadow-bottom-nav z-50 md:left-1/2 md:-translate-x-1/2 md:rounded-2xl pb-safe">
                {product.stock_qty === 0 ? (
                    <button disabled className="w-full bg-gray-100 text-gray-400 text-base font-bold py-3.5 rounded-xl border border-gray-200">
                        Out of Stock
                    </button>
                ) : qtyInCart === 0 ? (
                    <button
                        onClick={() => addItem(product as any, 1)}
                        className="w-full btn-primary py-3.5 text-base shadow-lg shadow-primary-500/20"
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-between bg-primary-600 text-white rounded-xl overflow-hidden h-14 shadow-lg shadow-primary-500/20">
                        <button
                            onClick={() => qtyInCart === 1 ? removeItem(product.id) : updateQty(product.id, qtyInCart - 1)}
                            className="w-1/3 h-full hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center justify-center"
                        >
                            <Minus size={24} />
                        </button>
                        <div className="flex-1 text-center font-bold text-lg">
                            {qtyInCart}
                        </div>
                        <button
                            onClick={() => updateQty(product.id, qtyInCart + 1)}
                            className="w-1/3 h-full hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center justify-center"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}
