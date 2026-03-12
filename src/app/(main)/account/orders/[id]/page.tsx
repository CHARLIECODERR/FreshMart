'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Truck, Package, MapPin, Download } from 'lucide-react'

import { format } from 'date-fns'
import { orderService } from '@/lib/services/orderService'
import { Order } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useAuth()
    const [order, setOrder] = React.useState<Order | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(params.id)
                setOrder(data)
            } finally {
                setLoading(false)
            }
        }
        if (!authLoading) fetchOrder()
    }, [params.id, authLoading])

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            case 'placed': return 'bg-blue-100 text-blue-700'
            case 'processing': return 'bg-orange-100 text-orange-700'
            case 'out_for_delivery': return 'bg-orange-100 text-orange-700'
            case 'shipped': return 'bg-indigo-100 text-indigo-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading || authLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-10 w-64 bg-gray-100 rounded-lg" />
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <div className="h-64 bg-gray-50 rounded-2xl" />
                        <div className="h-64 bg-gray-50 rounded-2xl" />
                    </div>
                    <div className="w-full lg:w-[360px] space-y-6">
                        <div className="h-48 bg-gray-50 rounded-2xl" />
                        <div className="h-48 bg-gray-50 rounded-2xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="py-20 text-center">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
                <p className="text-gray-500 mt-2 mb-6">We couldn't find the order you're looking for.</p>
                <Link href="/account/orders" className="btn-primary px-8">Back to Orders</Link>
            </div>
        )
    }
    return (
        <div className="animate-fade-in pb-10">

            <div className="flex items-center gap-3 mb-6">
                <Link href="/account/orders" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="font-bold text-xl text-gray-900 leading-tight">Order #{order.id.slice(-6).toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">{order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy, hh:mm a') : 'N/A'}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Col: Timeline & Items */}
                <div className="flex-1 space-y-6">

                    {/* Timeline / Progress */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 overflow-hidden relative">
                        <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>

                        <div className="relative pl-6 space-y-8">
                            {/* Vertical line connector */}
                            <div className="absolute top-2 bottom-2 left-8 w-[2px] bg-gray-100 z-0"></div>

                            {/* Dynamically build timeline from status and events */}
                            {(order.events || []).map((event, idx) => (
                                <div key={idx} className="relative z-10 flex gap-4 items-start">
                                    <div className="bg-white py-1">
                                        <CheckCircle2 size={20} className="text-primary-500 fill-primary-50" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 capitalize">
                                            {event.status.replace(/_/g, ' ')}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {format(new Date(event.created_at), 'hh:mm a, MMM dd')}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* If order is not delivered/cancelled, show pending steps? 
                                For simplicity, we just show active status from snapshots */}
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Items in this order</h3>

                        <div className="space-y-4">
                            {(order.items || []).map((item, idx) => (
                                <div key={idx} className={`flex justify-between items-start gap-4 ${idx !== 0 ? 'border-t border-gray-100 pt-4' : ''}`}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                            {item.product_snapshot.image_url ? (
                                                <img src={item.product_snapshot.image_url} alt={item.product_snapshot.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{item.product_snapshot.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.product_snapshot.unit} × {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-gray-900">₹{item.unit_price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Col: Summary & Address */}
                <div className="w-full lg:w-[360px] space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
                        <div className="space-y-2.5 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Items Total</span>
                                <span className="font-medium text-gray-900">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="text-primary-600 font-medium">{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-accent-600 font-bold">
                                    <span>Discount</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            <hr className="border-gray-100 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="font-display font-bold text-2xl text-primary-600">₹{order.total}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Paid via</p>
                            <p className="font-semibold text-sm text-gray-900 uppercase">{order.payment_method}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">{order.address_snapshot.full_name}</p>
                                <p className="text-gray-600 mt-0.5 text-xs">{order.address_snapshot.address_line}</p>
                                <p className="text-gray-600 text-xs">{order.address_snapshot.city} - {order.address_snapshot.pincode}</p>
                                <p className="text-slate-400 font-bold mt-2 text-[10px]">📞 {order.address_snapshot.phone}</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full btn-outline flex items-center justify-center gap-2 py-3 bg-white">
                        <Download size={18} /> Download Invoice
                    </button>

                </div>
            </div>
        </div>
    )
}
