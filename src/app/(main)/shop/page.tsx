'use client'

import React, { useState, useEffect } from 'react'
import ProductGrid from '@/components/product/ProductGrid'
import { Filter, ChevronDown, Check } from 'lucide-react'
import { Product } from '@/types'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'

export default function ShopPage() {
    const [activeSort, setActiveSort] = useState('popular')
    const [showFilters, setShowFilters] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const q = query(
                    collection(db, 'products'),
                    where('is_active', '==', true),
                    limit(40)
                )
                const querySnapshot = await getDocs(q)
                const prods = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[]
                setProducts(prods)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const sortOptions = [
        { id: 'popular', label: 'Popularity' },
        { id: 'price_asc', label: 'Price: Low to High' },
        { id: 'price_desc', label: 'Price: High to Low' },
        { id: 'newest', label: 'Newest Arrivals' }
    ]

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-10 pt-4">

            {/* Page Header & Controls */}
            <div className="sticky top-[60px] md:top-[72px] z-30 bg-background/90 backdrop-blur-md px-4 py-3 mb-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
                <h1 className="font-display font-bold text-xl text-gray-900">All Products</h1>

                <div className="flex items-center gap-2">
                    {/* Desktop Sort Dropdown */}
                    <div className="relative group hidden md:block">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                            Sort by <ChevronDown size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-card p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                            {sortOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setActiveSort(opt.id)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between ${activeSort === opt.id ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {opt.label}
                                    {activeSort === opt.id && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95 transition-transform"
                    >
                        <Filter size={16} /> <span className="hidden md:inline">Filters</span>
                    </button>
                </div>
            </div>

            <div className="px-4 mb-4 text-sm text-gray-500 font-medium">
                {loading ? 'Searching for fresh items...' : `Showing ${products.length} items`}
            </div>

            {loading ? (
                <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <ProductGrid
                    products={products}
                    columns="4"
                />
            )}

            {/* Filter Drawer Overlay - simplified for MVP layout */}
            {showFilters && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                    <div className="w-full max-w-sm md:w-[400px] h-full bg-white relative animate-slide-up md:animate-slide-left flex flex-col mt-auto rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg">Filters & Sort</h3>
                            <button onClick={() => setShowFilters(false)} className="text-gray-400 p-2 -mr-2">Close</button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            {/* Mobile Sort Options */}
                            <div className="mb-6 md:hidden">
                                <h4 className="font-semibold text-sm mb-3 text-gray-900">Sort By</h4>
                                <div className="space-y-2">
                                    {sortOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setActiveSort(opt.id)}
                                            className={`w-full text-left px-3 py-2.5 text-sm rounded-xl border transition-colors ${activeSort === opt.id ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold' : 'bg-white border-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-gray-900">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages'].map(cat => (
                                        <button key={cat} className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-600">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full btn-primary py-3 px-4 text-center font-bold text-base shadow-lg shadow-primary-500/30"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
