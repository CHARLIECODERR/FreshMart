'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Product, Category } from '@/types'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const pq = query(collection(db, 'products'), orderBy('created_at', 'desc'))
                const pSnap = await getDocs(pq)
                setProducts(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[])

                // Fetch Categories
                const cSnap = await getDocs(collection(db, 'categories'))
                setCategories(cSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[])
            } catch (error) {
                toast.error('Failed to load data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'active' && p.is_active && p.stock_qty > 0) ||
            (selectedStatus === 'out' && p.stock_qty <= 0)

        return matchesSearch && matchesCategory && matchesStatus
    })


    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-sm text-slate-500">Manage your store's inventory and catalog</p>
                </div>
                <Link href="/admin/products/new" className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2 text-sm">
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-center">
                <div className="relative w-full lg:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 lg:flex-none border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 cursor-pointer transition-all"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex-1 lg:flex-none border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 cursor-pointer transition-all"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6 text-left">Product</th>
                                <th className="py-4 px-6 text-left">Category</th>
                                <th className="py-4 px-6 text-right">Selling Price</th>
                                <th className="py-4 px-6 text-right">Stock</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center float-none shrink-0">
                                                {(product.images?.[0]?.url || product.image_url) ? (
                                                    <img src={(product.images?.[0]?.url || product.image_url) as string} className="w-full h-full object-cover" alt={product.name} />
                                                ) : (
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-slate-500">MRP: ₹{product.mrp}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">
                                        {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold text-slate-900">₹{product.price}</td>
                                    <td className="py-4 px-6 text-right">
                                        <span className={`font-semibold ${product.stock_qty <= 15 ? 'text-rose-600' : 'text-slate-700'}`}>
                                            {product.stock_qty}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5
                      ${product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                                        >
                                            {product.is_active ? (product.stock_qty > 0 ? 'Active' : 'Out of Stock') : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination mock */}
                <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing 1 to 3 of 42 results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-primary-50 text-primary-700 font-medium rounded">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

        </div>
    )
}
