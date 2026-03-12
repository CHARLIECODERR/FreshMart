'use client'

import React, { useState } from 'react'
import { Plus, MapPin, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Address } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export default function AddressesPage() {
    const { profile, updateAddresses, loading } = useAuth()
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addresses = profile?.addresses || []

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return
        const newAddresses = addresses.filter(a => a.id !== id)
        await updateAddresses(newAddresses)
    }

    const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (addresses.length >= 3) {
            alert('You can only save up to 3 addresses.')
            return
        }

        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const newAddr: Address = {
            id: uuidv4(),
            label: formData.get('label') as string,
            full_name: formData.get('full_name') as string,
            phone: formData.get('phone') as string,
            email: profile?.email || '',
            address_line: formData.get('address_line') as string,
            city: formData.get('city') as string,
            pincode: formData.get('pincode') as string,
            is_default: addresses.length === 0
        }

        const newAddresses = [...addresses, newAddr]
        await updateAddresses(newAddresses)
        setIsSubmitting(false)
        setShowAddForm(false)
    }

    if (loading) return (
        <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-gray-100 rounded" />
            <div className="grid md:grid-cols-2 gap-4">
                <div className="h-40 bg-gray-50 rounded-2xl" />
                <div className="h-40 bg-gray-50 rounded-2xl" />
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in pb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-bold text-xl text-gray-900">Saved Addresses</h2>
                    <p className="text-xs text-slate-500 mt-1">{addresses.length}/3 addresses saved</p>
                </div>
                {addresses.length < 3 && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary py-2 px-4 shadow-sm text-sm"
                    >
                        <Plus size={18} className="mr-1 inline" /> Add New
                    </button>
                )}
            </div>

            {addresses.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <MapPin className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No addresses saved yet.</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="text-primary-600 font-bold hover:underline mt-2 text-sm"
                    >
                        Add your first address &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white rounded-2xl p-5 border border-gray-200 relative group shadow-sm hover:border-primary-300 transition-colors">

                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {addr.label}
                                </span>
                                {addr.is_default && (
                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-green-50 text-green-600">
                                        Default
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-900">{addr.full_name}</h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed capitalize">
                                {addr.address_line}, {addr.city} - <span className="font-semibold text-slate-700">{addr.pincode}</span>
                            </p>

                            <p className="mt-4 font-semibold text-xs text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                                <span className="text-slate-300">📞</span> {addr.phone}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {showAddForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-scale-in">
                        <h3 className="font-bold text-xl mb-6 text-gray-900">Add New Address</h3>

                        <form className="space-y-4" onSubmit={handleAddAddress}>
                            <div className="grid grid-cols-3 gap-2 pb-2">
                                {['Home', 'Work', 'Other'].map(l => (
                                    <label key={l} className="relative cursor-pointer group">
                                        <input type="radio" name="label" value={l} className="peer sr-only" defaultChecked={l === 'Home'} />
                                        <div className="px-3 py-2 text-center rounded-xl border border-slate-200 text-xs font-bold text-slate-500 transition-all peer-checked:bg-primary-50 peer-checked:border-primary-400 peer-checked:text-primary-700 group-hover:bg-slate-50">
                                            {l}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <input name="full_name" type="text" placeholder="Full Name" className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none" required />
                            <input name="phone" type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" placeholder="10-digit Phone Number" className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none" required />

                            <div className="grid grid-cols-2 gap-3">
                                <input name="city" type="text" placeholder="City" className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none" required />
                                <input name="pincode" type="text" pattern="[0-9]{6}" title="6-digit pincode" placeholder="Pincode" className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none" required />
                            </div>

                            <textarea name="address_line" placeholder="Flat No, Building, Road name, Area..." rows={3} className="w-full bg-slate-50 border-transparent focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner outline-none resize-none" required />

                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
