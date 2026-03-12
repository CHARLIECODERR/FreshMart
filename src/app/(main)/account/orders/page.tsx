'use client'

import React from 'react'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'

// Dummy historical orders
const pastOrders = [
    { id: 'ORD-12345', date: 'Oct 12, 2023', total: 845, items: 4, status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
    { id: 'ORD-12344', date: 'Oct 05, 2023', total: 320, items: 2, status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
    { id: 'ORD-12343', date: 'Sep 28, 2023', total: 1150, items: 8, status: 'Cancelled', statusColor: 'bg-red-100 text-red-700' },
]

export default function OrderHistoryPage() {
    return (
        <div className="animate-fade-in">
            <h2 className="font-bold text-xl text-gray-900 mb-6">My Orders</h2>

            {pastOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">You haven't placed any orders yet. Start shopping to fill your fridge!</p>
                    <Link href="/shop" className="btn-primary px-8 shadow-sm">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {pastOrders.map((order, idx) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className={`block p-4 sm:p-5 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                        >
                            <div className="flex items-center justify-between">

                                {/* Left side: details */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm md:text-base">Order #{order.id}</h4>
                                        <p className="text-xs md:text-sm text-gray-500 mt-1 mb-2">
                                            {order.date} • {order.items} Items • <span className="font-semibold text-gray-900">₹{order.total}</span>
                                        </p>
                                        <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Right side: arrow */}
                                <div className="text-gray-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
