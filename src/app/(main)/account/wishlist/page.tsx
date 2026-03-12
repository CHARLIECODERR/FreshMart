'use client'

import React, { useState, useEffect } from 'react'
import ProductGrid from '@/components/product/ProductGrid'
import { useWishlistStore } from '@/contexts/useWishlistStore'
import { Product } from '@/types'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, documentId } from 'firebase/firestore'

export default function WishlistPage() {
    const { productIds } = useWishlistStore()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (productIds.length === 0) {
                setProducts([])
                return
            }

            setLoading(true)
            try {
                // Firestore 'in' query supports up to 10-30 IDs usually
                const q = query(
                    collection(db, 'products'),
                    where(documentId(), 'in', productIds.slice(0, 30))
                )
                const querySnapshot = await getDocs(q)
                const prods = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[]
                setProducts(prods)
            } catch (error) {
                console.error('Error fetching wishlist products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchWishlistProducts()
    }, [productIds])

    return (
        <div className="animate-fade-in -mx-4 md:mx-0">
            <div className="px-4 md:px-0 mb-6 flex items-center justify-between">
                <h2 className="font-bold text-xl text-gray-900 leading-tight">My Wishlist</h2>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {productIds.length} {productIds.length === 1 ? 'Item' : 'Items'}
                </span>
            </div>

            {loading ? (
                <div className="px-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : productIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl mx-4 md:mx-0 border border-gray-100 py-20 shadow-sm">
                    <div className="w-20 h-20 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-6 relative">
                        <Heart size={32} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
                        </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Wishlist is empty</h3>
                    <p className="text-gray-500 text-sm max-w-[280px] mb-8 leading-relaxed">
                        Explore our fresh collection and save items you love for later.
                    </p>
                    <Link href="/shop" className="btn-primary px-10 py-3 rounded-xl shadow-lg shadow-primary-500/20 flex items-center gap-2">
                        <ShoppingBag size={18} /> Start Shopping
                    </Link>
                </div>
            ) : (
                <ProductGrid products={products} columns="3" />
            )}
        </div>
    )
}
