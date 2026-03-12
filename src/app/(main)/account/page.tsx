'use client'

import React from 'react'
import Link from 'next/link'
import { Package, Heart, MapPin, Settings, ChevronRight } from 'lucide-react'

// Dummy Data for the UI View
const recentOrders = [
    { id: 'ORD-12345', date: 'Oct 12, 2023', total: 845, status: 'Delivered', items: 'Tomatoes, Milk, Bread + 3 more' }
]

export default function AccountOverview() {

    const blocks = [
        { label: 'My Orders', icon: <Package size={24} className="text-blue-500" />, href: '/account/orders', desc: 'Check your order status' },
        { label: 'Addresses', icon: <MapPin size={24} className="text-primary-500" />, href: '/account/addresses', desc: 'Save addresses for fast checkout' },
        { label: 'Wishlist', icon: <Heart size={24} className="text-red-500" />, href: '/account/wishlist', desc: 'Your saved items' },
        { label: 'Profile Settings', icon: <Settings size={24} className="text-gray-500" />, href: '/account/settings', desc: 'Update password & details' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {blocks.map(block => (
                    <Link
                        key={block.href}
                        href={block.href}
                        className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
                    >
                        <div className="mb-3 p-3 bg-gray-50 rounded-xl inline-block group-hover:scale-110 transition-transform">
                            {block.icon}
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-sm md:text-base">{block.label}</h3>
                        <p className="text-xs text-gray-500 mt-1 hidden md:block">{block.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg text-gray-900">Recent Orders</h2>
                    <Link href="/account/orders" className="text-primary-600 text-sm font-semibold hover:underline">
                        View All
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <Link key={order.id} href={`/account/orders/${order.id}`} className="block">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Order #{order.id}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{order.date} • ₹{order.total}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded hidden md:inline-block">
                                            {order.status}
                                        </span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500 text-sm">
                        No recent orders found.
                    </div>
                )}
            </div>

        </div>
    )
}
