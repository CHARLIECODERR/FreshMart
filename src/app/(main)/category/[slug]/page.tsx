'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { Product, Category } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
    const { slug } = useParams()
    const [products, setProducts] = useState<Product[]>([])
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            if (!slug) return
            setLoading(true)
            try {
                // 1. Fetch category details by slug
                const catRef = collection(db, 'categories')
                const catQuery = query(catRef, where('slug', '==', slug))
                const catSnap = await getDocs(catQuery)

                if (!catSnap.empty) {
                    const catData = { id: catSnap.docs[0].id, ...catSnap.docs[0].data() } as Category
                    setCategory(catData)

                    // 2. Fetch products for this category
                    const prodRef = collection(db, 'products')
                    const prodQuery = query(prodRef, where('category_id', '==', catData.id), limit(20))
                    const prodSnap = await getDocs(prodQuery)

                    setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[])
                }
            } catch (error) {
                console.error('Error loading category data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategoryAndProducts()
    }, [slug])

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    📦
                </div>
                <h2 className="text-xl font-bold text-gray-900">Category not found</h2>
                <p className="text-gray-500 mt-2 mb-6 text-sm">The category you are looking for doesn't exist or has been removed.</p>
                <Link href="/" className="btn-primary px-8">Return Home</Link>
            </div>
        )
    }

    return (
        <div className="pb-10 animate-fade-in">
            {/* Breadcrumbs */}
            <div className="px-4 py-3 flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                    <Home size={12} />
                    Home
                </Link>
                <ChevronRight size={10} />
                <span className="text-gray-900">{category.name}</span>
            </div>

            {/* Header */}
            <div className="px-4 mb-6">
                <h1 className="text-2xl font-display font-bold text-gray-900">{category.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Showing all fresh {category.name.toLowerCase()} available today.</p>
            </div>

            {/* Product Grid */}
            <div className="px-4">
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-10 text-center border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No products found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
