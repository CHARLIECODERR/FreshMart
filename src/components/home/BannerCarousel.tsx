'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Banner } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock banners if none from DB
const defaultBanners: Banner[] = [
    {
        id: '1',
        title: 'Fresh Organic Greens',
        subtitle: 'Farm to table essentials delivered in 15 mins. Use code: GREEN40',
        image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
        link_url: '/category/vegetables',
        display_order: 1,
        is_active: true,
    },
    {
        id: '2',
        title: 'Morning Dairy Delights',
        subtitle: 'Pure milk and farm-fresh eggs for a healthy start.',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=1200',
        link_url: '/category/dairy-bakery',
        display_order: 2,
        is_active: true,
    },
]

export default function BannerCarousel({ banners = defaultBanners }: { banners?: Banner[] }) {
    if (!banners || banners.length === 0) return null

    return (
        <div className="w-full relative px-4 md:px-0 mb-8 mt-4 group">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                loop={banners.length > 1}
                className="rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10"
                style={{
                    // @ts-ignore
                    '--swiper-pagination-color': '#fff',
                    '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.4)',
                    '--swiper-pagination-bullet-inactive-opacity': '1',
                }}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <Link href={banner.link_url || '/shop'} className="block relative aspect-[1.8/1] md:aspect-[3.2/1] w-full bg-gray-100 group">
                            <Image
                                src={banner.image_url}
                                alt={banner.title || 'Promotional Banner'}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                                priority={banner.display_order === 1}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                            {/* Text Content */}
                            <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16 max-w-[85%] md:max-w-[60%]">
                                <div className="space-y-4 animate-slide-up">
                                    {banner.title && (
                                        <h2 className="text-white font-display font-black text-2xl md:text-4xl lg:text-5xl leading-[1.1] drop-shadow-lg tracking-tight">
                                            {banner.title}
                                        </h2>
                                    )}
                                    {banner.subtitle && (
                                        <p className="text-white/90 text-sm md:text-xl font-medium drop-shadow-md break-words line-clamp-2 max-w-lg">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    <div className="pt-2">
                                        <span className="inline-flex items-center justify-center bg-white text-primary-600 font-bold px-6 py-3 rounded-2xl text-xs md:text-base shadow-xl w-max hover:bg-gray-50 active:scale-95 transition-all group-hover:shadow-primary-400/20">
                                            Shop Collection
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
                    <ChevronLeft size={24} />
                </button>
                <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90">
                    <ChevronRight size={24} />
                </button>
            </Swiper>
        </div>
    )
}
