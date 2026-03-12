'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Truck, Package, MapPin, Download } from 'lucide-react'

// Dummy order detail
const order = {
    id: 'ORD-12345',
    date: 'Oct 12, 2023, 10:30 AM',
    status: 'Out for Delivery',
    itemsTotal: 845,
    deliveryFee: 0,
    discount: 45,
    total: 800,
    paymentMethod: 'Cash on Delivery',
    address: {
        name: 'John Doe',
        line1: 'A-102, Green Valley Apartments',
        city: 'Mumbai',
        pincode: '400001'
    },
    items: [
        { name: 'Farm Fresh Tomatoes (Local)', qty: 1, price: 45, unit: '1 kg' },
        { name: 'Ashirvaad Whole Wheat Atta', qty: 1, price: 260, unit: '5 kg' },
        { name: 'Farm Fresh Milk (Full Cream)', qty: 2, price: 66, unit: '1 L' }
    ],
    timeline: [
        { status: 'Order Placed', time: '10:30 AM, Oct 12', done: true },
        { status: 'Order Confirmed', time: '10:35 AM, Oct 12', done: true },
        { status: 'Packed', time: '11:15 AM, Oct 12', done: true },
        { status: 'Out for Delivery', time: '11:45 AM, Oct 12', done: true },
        { status: 'Delivered', time: 'Expected by 12:30 PM', done: false }
    ]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="animate-fade-in pb-10">

            <div className="flex items-center gap-3 mb-6">
                <Link href="/account/orders" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="font-bold text-xl text-gray-900 leading-tight">Order #{params.id}</h2>
                    <p className="text-xs text-gray-500">{order.date}</p>
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

                            {order.timeline.map((step, idx) => (
                                <div key={idx} className="relative z-10 flex gap-4 items-start">
                                    <div className="bg-white py-1">
                                        {step.done ? (
                                            <CheckCircle2 size={20} className="text-primary-500 fill-primary-50" />
                                        ) : (
                                            <Circle size={20} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.status}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Items in this order</h3>

                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className={`flex justify-between items-start gap-4 ${idx !== 0 ? 'border-t border-gray-100 pt-4' : ''}`}>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                                            <Package size={20} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.unit} × {item.qty}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-gray-900">₹{item.price * item.qty}</span>
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
                                <span className="font-medium text-gray-900">₹{order.itemsTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="text-primary-600 font-medium">{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
                            </div>
                            <div className="flex justify-between text-accent-600">
                                <span>Discount</span>
                                <span className="font-medium">-₹{order.discount}</span>
                            </div>
                            <hr className="border-gray-100 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="font-display font-bold text-lg text-gray-900">₹{order.total}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Paid via</p>
                            <p className="font-semibold text-sm text-gray-900">{order.paymentMethod}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900">{order.address.name}</p>
                                <p className="text-gray-600 mt-0.5">{order.address.line1}</p>
                                <p className="text-gray-600">{order.address.city} - {order.address.pincode}</p>
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
