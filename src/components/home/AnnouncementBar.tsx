'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

export default function AnnouncementBar() {
    return (
        <div className="bg-primary-600 text-white overflow-hidden py-2 relative z-[60]">
            <div className="flex animate-marquee whitespace-nowrap items-center">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-8 mx-4">
                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={14} className="text-yellow-300" />
                            Exclusive Offer: Get 20% OFF on your first order! Use code: FRESH20
                        </span>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            🚀 Free Delivery on orders above ₹499
                        </span>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            🍎 Fresh Organic Groceries delivered in 15 mins
                        </span>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
