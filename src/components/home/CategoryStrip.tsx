'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/types'
import { ArrowRight } from 'lucide-react'

export default function CategoryStrip({ categories = [] }: { categories?: Category[] }) {
    return (
        <div className="mb-10 w-full overflow-hidden">
            <div className="flex items-end justify-between px-4 pb-4">
                <h3 className="font-display font-bold text-lg md:text-2xl text-gray-900 tracking-tight">Shop by Category</h3>
                <Link href="/shop" className="text-primary-600 text-xs md:text-sm font-semibold flex items-center hover:text-primary-700">
                    See All <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-4 snap-x">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-xl w-full text-slate-500 text-sm">
                        No categories found. Add some from the Admin Panel.
                    </div>
                ) : (
                    categories.map((cat, index) => (
                        <Link
                            key={cat.id || index}
                            href={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-2 group snap-start shrink-0 w-[80px] md:w-[100px]"
                        >
                            {/* Image Circle */}
                            <div className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden relative shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow group-active:scale-95 duration-200">
                                {cat.image_url ? (
                                    <Image
                                        src={cat.image_url}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold text-2xl">
                                        {cat.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span className="text-[11px] md:text-sm font-medium text-center text-gray-700 leading-tight line-clamp-2 px-1 group-hover:text-primary-600 transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))
                )}
                {/* Empty space at end to allow full scroll */}
                <div className="w-1 shrink-0"></div>
            </div>
        </div>
    )
}
