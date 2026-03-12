import React, { useEffect, useState } from 'react'
import { Sparkles, Tag } from 'lucide-react'
import { couponService } from '@/lib/services/couponService'
import { Coupon } from '@/types'

export default function AnnouncementBar() {
    const [coupons, setCoupons] = useState<Coupon[]>([])

    useEffect(() => {
        const fetch = async () => {
            const data = await couponService.getActiveCoupons()
            setCoupons(data)
        }
        fetch()
    }, [])

    return (
        <div className="bg-primary-600 text-white overflow-hidden py-2 relative z-[60] w-full">
            <div className="flex animate-marquee whitespace-nowrap items-center">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-8 mx-4">
                        {coupons.length > 0 ? (
                            coupons.map((coupon) => (
                                <React.Fragment key={coupon.id}>
                                    <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                        <Tag size={12} className="text-yellow-300" />
                                        Use Code: {coupon.code} for {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF!
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                </React.Fragment>
                            ))
                        ) : (
                            <>
                                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                    <Sparkles size={14} className="text-yellow-300" />
                                    Exclusive Offer: Get 20% OFF on your first order! Use code: FRESH20
                                </span>
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                    🚀 Free Delivery on orders above ₹499
                                </span>
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                            </>
                        )}
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
