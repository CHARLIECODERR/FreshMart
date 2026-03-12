'use client'
import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, ShoppingBag, AlertCircle, Package } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase/config'
import { collection, getCountFromServer } from 'firebase/firestore'

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({ products: 0, categories: 0, orders: 0, customers: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pSnap, cSnap] = await Promise.all([
                    getCountFromServer(collection(db, 'products')),
                    getCountFromServer(collection(db, 'categories')),
                ])
                setCounts({
                    products: pSnap.data().count,
                    categories: cSnap.data().count,
                    orders: 0, // Placeholder
                    customers: 0 // Placeholder
                })
            } catch (error) {
                console.error('Stats error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const metrics = [
        { label: 'Total Products', value: counts.products.toString(), trend: 'Live', icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Categories', value: counts.categories.toString(), trend: 'Live', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Orders', value: '0', trend: 'Wait', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Active Customers', value: '0', trend: 'Wait', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50' },
    ]

    const recentOrders = [
        { id: 'ORD-1004', customer: 'Rahul Sharma', amount: 845, status: 'placed', items: 'Tomatoes, Atta...', time: '10 mins ago' },
        { id: 'ORD-1003', customer: 'Priya Patel', amount: 1250, status: 'packed', items: 'Milk, Bread, Eggs...', time: '45 mins ago' },
        { id: 'ORD-1002', customer: 'Amit Singh', amount: 320, status: 'shipped', items: 'Lays, Coca Cola...', time: '2 hours ago' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => {
                    const Icon = m.icon
                    return (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.bg} ${m.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-sm font-semibold ${m.trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {m.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{m.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{m.value}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Order ID</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-semibold text-slate-900">{order.id}</td>
                                        <td className="py-4">
                                            <p className="font-medium text-slate-900">{order.customer}</p>
                                            <p className="text-xs text-slate-500">{order.items}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize
                        ${order.status === 'placed' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'packed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-emerald-100 text-emerald-700'}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right font-bold text-slate-900">₹{order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>

                    <div className="space-y-3">
                        <Link href="/admin/products/new" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all group">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 text-slate-600 group-hover:text-primary-600">
                                <Package size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 group-hover:text-primary-700">Add New Product</h4>
                                <p className="text-xs text-slate-500">Publish to storefront</p>
                            </div>
                        </Link>

                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                            <AlertCircle size={20} className="text-rose-500 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-rose-900 text-sm">Low Stock Alert</h4>
                                <p className="text-xs text-rose-700 mt-1">12 items are falling below the minimum threshold. Time to restock!</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
