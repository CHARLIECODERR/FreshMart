'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, Tag, ChevronRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/contexts/useCartStore'
import { useAuthStore } from '@/contexts/useAuthStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CartPage() {
    const cartItems = useCartStore(state => state.items)
    const cartTotal = useCartStore(state => state.total())
    const updateQty = useCartStore(state => state.updateQty)
    const removeItem = useCartStore(state => state.removeItem)
    const user = useAuthStore(state => state.user)
    const router = useRouter()

    const [coupon, setCoupon] = useState('')
    const [isApplying, setIsApplying] = useState(false)

    const deliveryFee = cartTotal > 499 ? 0 : 40
    const totalAmount = cartTotal + deliveryFee

    const handleCheckout = () => {
        if (!user) {
            toast.success('Please login to checkout', { icon: '👋' })
            router.push('/login?redirect=/checkout')
            return
        }
        router.push('/checkout')
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-background">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <ShoppingBag size={40} className="text-primary-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 text-center max-w-sm mb-8 text-sm md:text-base">
                    Looks like you haven't added any groceries yet. Start shopping and fill your fridge!
                </p>
                <Link href="/" className="btn-primary px-8 py-3.5 shadow-lg shadow-primary-500/30">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32 md:pb-12 pt-4 px-4 max-w-5xl mx-auto">
            <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

                {/* Cart Items List */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {cartItems.map((item, idx) => (
                            <div key={item.product_id} className={`p-4 flex gap-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                                {/* Product Image */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 relative overflow-hidden">
                                    <Image
                                        src={item.product.images?.[0]?.url || ''}
                                        alt={item.product.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 pr-4">{item.product.name}</h3>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-gray-400 hover:text-red-500 p-1 -mr-1 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500 mb-2">{item.product.unit}</span>

                                    <div className="mt-auto flex items-center justify-between">
                                        {/* Price */}
                                        <div className="font-bold text-gray-900 md:text-lg">
                                            ₹{item.product.price}
                                        </div>

                                        {/* Quantity Stepper */}
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 h-9">
                                            <button
                                                onClick={() => item.quantity > 1 ? updateQty(item.product_id, item.quantity - 1) : removeItem(item.product_id)}
                                                className="px-2.5 h-full text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-l-xl transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item.product_id, item.quantity + 1)}
                                                className="px-2.5 h-full text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-r-xl transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bill Details & Checkout */}
                <div className="w-full lg:w-[380px] flex flex-col gap-4">

                    {/* Coupon Input */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon code"
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-50 uppercase"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (!coupon) return;
                                    setIsApplying(true);
                                    setTimeout(() => { setIsApplying(false); toast.error('Invalid or expired coupon') }, 1000);
                                }}
                                disabled={!coupon || isApplying}
                                className="btn-outline px-4 shrink-0 bg-white"
                            >
                                {isApplying ? '...' : 'Apply'}
                            </button>
                        </div>
                        {/* View offers link */}
                        <button className="text-primary-600 text-xs font-semibold mt-3 flex items-center">
                            View all offers <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Items Total ({cartItems.length})</span>
                                <span className="font-medium text-gray-900">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className={deliveryFee === 0 ? 'text-primary-600 font-semibold' : 'text-gray-900 font-medium'}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            {deliveryFee > 0 && (
                                <div className="text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
                                    Add items worth ₹{500 - cartTotal} more to get free delivery.
                                </div>
                            )}

                            <hr className="border-gray-100 my-2" />

                            <div className="flex justify-between items-center bg-green-50/50 -mx-5 px-5 py-3 border-y border-green-100">
                                <span className="font-bold text-gray-900 text-base">To Pay</span>
                                <span className="font-display font-bold text-xl text-gray-900">₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Action Banner (Sticky on Mobile, Static on Desktop) */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-bottom-nav p-4 z-40 pb-safe md:static md:bg-transparent md:border-0 md:p-0 md:shadow-none">
                        <button
                            onClick={handleCheckout}
                            className="w-full btn-primary py-4 text-base font-bold shadow-xl shadow-primary-500/20 flex items-center justify-between px-6"
                        >
                            <div className="flex flex-col items-start leading-tight text-white">
                                <span className="text-sm font-medium text-white/90">{cartItems.length} items</span>
                                <span className="text-lg">₹{totalAmount}</span>
                            </div>
                            <span className="flex items-center gap-1">
                                Checkout <ChevronRight size={18} />
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
