'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Image as ImageIcon, X, Save } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Banner } from '@/types'
import toast from 'react-hot-toast'
import { createBanner, updateBanner, deleteBanner } from '@/lib/services/bannerService'

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner> | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const fetchBanners = async () => {
        setLoading(true)
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

    useEffect(() => {
        fetchBanners()
    }, [])

    const handleOpenModal = (banner?: Banner) => {
        setCurrentBanner(banner || {
            title: '',
            subtitle: '',
            image_url: '',
            link_url: '',
            display_order: banners.length + 1,
            is_active: true
        })
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentBanner?.image_url) return toast.error('Image URL is required')

        setIsSaving(true)
        try {
            if (currentBanner.id) {
                await updateBanner(currentBanner.id, currentBanner)
                toast.success('Banner updated successfully')
            } else {
                await createBanner(currentBanner as Omit<Banner, 'id'>)
                toast.success('Banner created successfully')
            }
            setIsModalOpen(false)
            fetchBanners()
        } catch (error) {
            toast.error('Failed to save banner')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return
        try {
            await deleteBanner(id)
            toast.success('Banner deleted')
            fetchBanners()
        } catch (error) {
            toast.error('Failed to delete banner')
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
                    <p className="text-sm text-slate-500">Manage promotional carousels shown on the Home Page</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Banner
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading banners...</div>
                ) : banners.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No banners found. Add your first promotional banner!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                    <th className="py-4 px-6">Image</th>
                                    <th className="py-4 px-6">Content</th>
                                    <th className="py-4 px-6">Order</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100">
                                {banners.map((bnr) => (
                                    <tr key={bnr.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="w-24 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {bnr.image_url ? (
                                                    <img src={bnr.image_url} className="w-full h-full object-cover" alt={bnr.title || ''} />
                                                ) : (
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-slate-900">{bnr.title || 'No Title'}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{bnr.subtitle}</div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-slate-400">{bnr.display_order}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                                                ${bnr.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                                            >
                                                {bnr.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(bnr)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bnr.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">{currentBanner?.id ? 'Edit Banner' : 'New Banner'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Banner Image URL</label>
                                    <input
                                        type="url"
                                        required
                                        value={currentBanner?.image_url || ''}
                                        onChange={e => setCurrentBanner({ ...currentBanner, image_url: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                                    <input
                                        type="text"
                                        value={currentBanner?.title || ''}
                                        onChange={e => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                        placeholder="e.g. Summer Sale"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subtitle</label>
                                    <textarea
                                        value={currentBanner?.subtitle || ''}
                                        onChange={e => setCurrentBanner({ ...currentBanner, subtitle: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none h-20 resize-none"
                                        placeholder="Banner description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={currentBanner?.display_order || 0}
                                        onChange={e => setCurrentBanner({ ...currentBanner, display_order: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                                    <select
                                        value={currentBanner?.is_active ? 'true' : 'false'}
                                        onChange={e => setCurrentBanner({ ...currentBanner, is_active: e.target.value === 'true' })}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Hidden</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Saving...' : 'Save Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
