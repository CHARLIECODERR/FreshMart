'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Banner } from '@/types'
import toast from 'react-hot-toast'

export default function AdminBannersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const q = query(collection(db, 'banners'), orderBy('display_order', 'asc'))
                const querySnapshot = await getDocs(q)
                setBanners(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Banner[])
            } catch (error) {
                toast.error('Failed to load banners')
            } finally {
                setLoading(false)
            }
        }
        fetchBanners()
    }, [])


    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
                    <p className="text-sm text-slate-500">Manage promotional carousels shown on the Home Page</p>
                </div>
                <button className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={18} /> Upload Banner
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6 text-left">Banner Image</th>
                                <th className="py-4 px-6 text-left">Title / Internal Name</th>
                                <th className="py-4 px-6 text-left">Target Link</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {banners.map((bnr) => (
                                <tr key={bnr.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="w-24 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                                            {bnr.image_url ? (
                                                <img src={bnr.image_url} className="w-full h-full object-cover" alt={bnr.title || ''} />
                                            ) : (
                                                <ImageIcon size={20} className="text-slate-300" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-900 font-semibold">{bnr.title || 'Untitled Banner'}</td>
                                    <td className="py-4 px-6 text-primary-600 hover:underline">{bnr.link_url || 'No link'}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${bnr.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                                        >
                                            {bnr.is_active ? 'Active' : 'Hidden'}
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
            </div>

        </div>
    )
}
