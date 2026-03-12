'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Search, Tag, Trash2, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-react'
import { couponService } from '@/lib/services/couponService'
import { Coupon } from '@/types'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [adding, setAdding] = useState(false)

    // Form
    const [code, setCode] = useState('')
    const [type, setType] = useState<'percent' | 'flat'>('percent')
    const [value, setValue] = useState('')
    const [minOrder, setMinOrder] = useState('0')

    useEffect(() => {
        loadCoupons()
    }, [])

    const loadCoupons = async () => {
        try {
            const data = await couponService.getCoupons()
            setCoupons(data)
        } catch (error) {
            toast.error('Failed to load coupons')
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setAdding(true)
        try {
            await couponService.addCoupon({
                code: code.toUpperCase(),
                discount_type: type,
                discount_value: Number(value),
                min_order_value: Number(minOrder),
                max_uses: null,
                valid_from: null,
                valid_until: null,
                is_active: true
            })
            toast.success('Coupon added successfully!')
            setCode('')
            setValue('')
            setShowAddModal(false)
            loadCoupons()
        } catch (error) {
            toast.error('Failed to add coupon')
        } finally {
            setAdding(false)
        }
    }

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            await couponService.toggleStatus(id, current)
            toast.success('Status updated')
            loadCoupons()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        try {
            await couponService.deleteCoupon(id)
            toast.success('Coupon deleted')
            loadCoupons()
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    return (
        <div className="space-y-6 animate-fade-in relative">
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Coupon</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Coupon Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. SAVEMORE10"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                                    >
                                        <option value="percent">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Value</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Order Value (₹)</label>
                                <input
                                    type="number"
                                    value={minOrder}
                                    onChange={(e) => setMinOrder(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl shadow-md hover:bg-primary-700 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {adding ? <Loader2 size={18} className="animate-spin" /> : 'Create Coupon'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Coupons & Offers</h1>
                    <p className="text-sm text-slate-500">Manage promotional codes and exclusive deals</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus size={18} /> Add Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-10 transition-colors ${coupon.is_active ? 'bg-primary-500' : 'bg-slate-500'}`} />

                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                                <Tag size={20} />
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                    className={`p-2 rounded-lg transition-colors ${coupon.is_active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {coupon.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">{coupon.code}</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} FLAT OFF`}
                        </p>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Min. Order: ₹{coupon.min_order_value}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${coupon.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {coupon.is_active ? 'Active' : 'Draft'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {coupons.length === 0 && !loading && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-20 text-center">
                    <Tag size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">No coupons active. Create your first offer!</p>
                </div>
            )}
        </div>
    )
}
