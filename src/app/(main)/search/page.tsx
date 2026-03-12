'use client'

import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, X, Clock, ArrowUpRight } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import { Product } from '@/types'

// Mock Data
const recentSearches = ['Milk', 'Atta 5kg', 'Tomatoes', 'Bread']
const suggestedSearches = ['Onions', 'Eggs', 'Amul Butter', 'Maggi', 'Paneer']

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    // Fake search logic
    const isSearching = query.length > 2
    const results: Product[] = isSearching ? [] : [] // Empty for now, would connect to actual search API

    return (
        <div className="min-h-[100dvh] bg-background">

            {/* Sticky Search Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 p-4 shadow-sm">
                <div className="relative flex items-center max-w-2xl mx-auto">
                    <SearchIcon size={20} className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIsTyping(e.target.value.length > 0)
                        }}
                        placeholder="Search for groceries, fruits, veggies..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-base focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all shadow-inner"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setIsTyping(false); }}
                            className="absolute right-3 p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 md:p-6 max-w-2xl mx-auto">

                {!isSearching && !isTyping && (
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
                                        onClick={() => setQuery(term)}
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
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Deals</h3>
                            <div className="flex flex-col gap-1">
                                {suggestedSearches.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
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
                {isTyping && !isSearching && (
                    <div className="flex justify-center items-center py-10 opacity-60">
                        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Search Results */}
                {isSearching && (
                    <div className="animate-fade-in -mx-4 md:mx-0">
                        {results.length > 0 ? (
                            <ProductGrid products={results} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <SearchIcon size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                                <p className="text-sm text-gray-500 max-w-xs">We couldn't find anything matching "{query}". Try searching for something else like "Milk" or "Atta".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
