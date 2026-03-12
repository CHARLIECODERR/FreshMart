'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { orderService } from '@/lib/services/orderService'
import { Order } from '@/types'
import { format } from 'date-fns'

export default function OrderHistoryPage() {
    const { user, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return
            try {
                const data = await orderService.getUserOrders(user.uid)
                setOrders(data)
            } finally {
                setLoading(false)
            }
        }
        if (!authLoading && user) fetchOrders()
        else if (!authLoading && !user) setLoading(false)
    }, [user, authLoading])

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            case 'placed': return 'bg-blue-100 text-blue-700'
            case 'processing': return 'bg-orange-100 text-orange-700'
            case 'shipped': return 'bg-indigo-100 text-indigo-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading || authLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-40 bg-gray-100 rounded-lg mb-6" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-50 rounded-2xl border border-gray-100" />
                ))}
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <h2 className="font-bold text-xl text-gray-900 mb-6">My Orders</h2>

            {orders.length === 0 ? (
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
                    {orders.map((order, idx) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className={`block p-4 sm:p-5 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm md:text-base capitalize">Order #{order.id.slice(-6).toUpperCase()}</h4>
                                        <p className="text-xs md:text-sm text-gray-500 mt-1 mb-2">
                                            {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy') : 'N/A'} • {order.items?.length || 0} Items • <span className="font-semibold text-gray-900">₹{order.total}</span>
                                        </p>
                                        <span className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded capitalize ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
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
