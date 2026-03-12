'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Banner } from '@/types'

// Mock banners if none from DB
const defaultBanners: Banner[] = [
    {
        id: '1',
        title: 'Fresh Vegetables Daily',
        subtitle: 'Up to 40% OFF on organic greens',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        link_url: '/category/vegetables',
        display_order: 1,
        is_active: true,
    },
    {
        id: '2',
        title: 'Morning Breakfast Needs',
        subtitle: 'Milk, Bread & Eggs delivered fresh',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
        link_url: '/category/dairy-bakery',
        display_order: 2,
        is_active: true,
    },
]

export default function BannerCarousel({ banners = defaultBanners }: { banners?: Banner[] }) {
    if (!banners || banners.length === 0) return null

    return (
        <div className="w-full relative px-4 md:px-0 mb-8 mt-4">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                loop={banners.length > 1}
                className="rounded-2xl overflow-hidden shadow-card"
                style={{
                    // @ts-ignore
                    '--swiper-pagination-color': '#fff',
                    '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.5)',
                    '--swiper-pagination-bullet-inactive-opacity': '1',
                }}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <Link href={banner.link_url || '/shop'} className="block relative aspect-[2/1] md:aspect-[3/1] w-full bg-gray-100 group">
                            <Image
                                src={banner.image_url}
                                alt={banner.title || 'Promotional Banner'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority={banner.display_order === 1}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                            {/* Text Content */}
                            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 max-w-[70%]">
                                {banner.title && (
                                    <h2 className="text-white font-display font-bold text-xl md:text-3xl lg:text-4xl leading-tight mb-2 drop-shadow-md">
                                        {banner.title}
                                    </h2>
                                )}
                                {banner.subtitle && (
                                    <p className="text-white/90 text-sm md:text-lg font-medium drop-shadow break-words line-clamp-2 mb-4">
                                        {banner.subtitle}
                                    </p>
                                )}
                                <span className="inline-flex items-center justify-center bg-white text-primary-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm shadow-lg w-max hover:bg-gray-50 active:scale-95 transition-all">
                                    Shop Now
                                </span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
