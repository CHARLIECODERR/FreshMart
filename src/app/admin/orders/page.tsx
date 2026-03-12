'use client'

import React, { useState } from 'react'
import { Package, Search, ExternalLink, RefreshCw } from 'lucide-react'

const mockOrders = [
    { id: 'ORD-1005', customer: 'Suresh Kumar', amount: 845, items: 'Tomatoes (1 kg), Atta (5 kg)', status: 'placed', date: 'Oct 12, 10:30 AM' },
    { id: 'ORD-1004', customer: 'Rahul Sharma', amount: 320, items: 'Lays, Coca Cola', status: 'packed', date: 'Oct 12, 09:15 AM' },
    { id: 'ORD-1003', customer: 'Priya Patel', amount: 1250, items: 'Milk, Bread, Eggs, Butter', status: 'out_for_delivery', date: 'Oct 11, 04:45 PM' },
    { id: 'ORD-1002', customer: 'Amit Singh', amount: 560, items: 'Rice, Dal', status: 'delivered', date: 'Oct 10, 11:20 AM' },
]

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState(mockOrders)
    const [loading, setLoading] = useState<string | null>(null)

    const updateStatus = (orderId: string, newStatus: string) => {
        setLoading(orderId)
        // Simulate API delay
        setTimeout(() => {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            setLoading(null)
        }, 800)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'placed': return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">New / Placed</span>
            case 'packed': return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">Packed</span>
            case 'out_for_delivery': return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700">Out for Delivery</span>
            case 'delivered': return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">Delivered</span>
            default: return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">{status}</span>
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                    <p className="text-sm text-slate-500">Manage fulfillments and track deliveries</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6">Order Details</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Amount</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Fulfillment Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-1">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{order.id}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{order.items}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{order.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-slate-700">{order.customer}</td>
                                    <td className="py-4 px-6 font-bold text-slate-900">₹{order.amount}</td>
                                    <td className="py-4 px-6">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Contextual Actions based on state */}
                                            {order.status === 'placed' && (
                                                <button onClick={() => updateStatus(order.id, 'packed')} disabled={loading === order.id} className="px-3 py-1.5 text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50">
                                                    {loading === order.id ? <RefreshCw size={14} className="animate-spin" /> : 'Mark as Packed'}
                                                </button>
                                            )}
                                            {order.status === 'packed' && (
                                                <button onClick={() => updateStatus(order.id, 'out_for_delivery')} disabled={loading === order.id} className="px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50">
                                                    {loading === order.id ? <RefreshCw size={14} className="animate-spin" /> : 'Ship Order'}
                                                </button>
                                            )}
                                            {order.status === 'out_for_delivery' && (
                                                <button onClick={() => updateStatus(order.id, 'delivered')} disabled={loading === order.id} className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50">
                                                    {loading === order.id ? <RefreshCw size={14} className="animate-spin" /> : 'Mark Delivered'}
                                                </button>
                                            )}

                                            <button className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm" title="View Order Receipt">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
