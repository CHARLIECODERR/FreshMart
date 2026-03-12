'use client'

import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, X, Clock, ArrowUpRight } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import { Product } from '@/types'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from 'firebase/firestore'

// Mock Data
const recentSearches = ['Milk', 'Atta 5kg', 'Tomatoes', 'Bread']
const suggestedSearches = ['Onions', 'Eggs', 'Amul Butter', 'Maggi', 'Paneer']

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length < 2) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                // Note: Firestore doesn't support full-text search out of the box.
                // We'll use the common prefix query trick for simple demonstration
                const q = query(
                    collection(db, 'products'),
                    where('is_active', '==', true),
                    orderBy('name'),
                    startAt(searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)), // Simple capitalization check
                    endAt(searchTerm + '\uf8ff'),
                    limit(10)
                )

                const querySnapshot = await getDocs(q)
                const prods = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[]
                setResults(prods)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const isSearching = searchTerm.length > 2

    return (
        <div className="min-h-[100dvh] bg-background">

            {/* Sticky Search Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 p-4 shadow-sm">
                <div className="relative flex items-center max-w-2xl mx-auto">
                    <SearchIcon size={20} className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for groceries, fruits, veggies..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-base focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all shadow-inner"
                        autoFocus
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 md:p-6 max-w-2xl mx-auto">

                {!isSearching && searchTerm.length === 0 && (
                    <div className="animate-fade-in">
                        {/* Recent Searches */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
                                Recent Searches
                                <button className="text-primary-600 text-xs hover:underline">Clear</button>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setSearchTerm(term)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary-500 transition-colors"
                                    >
                                        <Clock size={14} className="text-gray-400" />
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trending / Suggested */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 font-display">Trending Deals</h3>
                            <div className="flex flex-col gap-1">
                                {suggestedSearches.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setSearchTerm(term)}
                                        className="flex items-center justify-between px-2 py-3 border-b border-gray-100 active:bg-gray-50 text-left transition-colors last:border-0"
                                    >
                                        <span className="text-sm md:text-base text-gray-800 font-medium">{term}</span>
                                        <ArrowUpRight size={16} className="text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Searching States */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Search Results */}
                {isSearching && !loading && (
                    <div className="animate-fade-in -mx-4 md:mx-0">
                        {results.length > 0 ? (
                            <ProductGrid products={results} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-primary-500">
                                    <SearchIcon size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                    We couldn't find anything matching "{searchTerm}". Try searching for something else like "Milk" or "Atta".
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
