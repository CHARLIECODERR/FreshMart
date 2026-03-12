'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { db, storage } from '@/lib/firebase/config'
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Category } from '@/types'
import toast from 'react-hot-toast'

export default function AddProductPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])

    // Form State
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('45')
    const [mrp, setMrp] = useState('60')
    const [stock, setStock] = useState('100')
    const [unit, setUnit] = useState('1 kg')
    const [category, setCategory] = useState('')
    const [isFeatured, setIsFeatured] = useState(false)

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'))
                setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[])
            } catch (err) {
                console.error(err)
            }
        }
        fetchCats()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) return toast.error('File size too large (max 5MB)')
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress(progress)
                },
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                    resolve(downloadURL)
                }
            )
        })
    }

    const discountPercent = mrp && price && Number(mrp) > Number(price)
        ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)
        : 0

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!category) return toast.error('Please select a category')

        setLoading(true)

        try {
            let finalImageUrl = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop' // fallback

            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile)
            }

            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            await addDoc(collection(db, 'products'), {
                name,
                slug,
                description,
                price: Number(price),
                mrp: Number(mrp),
                stock_qty: Number(stock),
                unit,
                category_id: category,
                is_featured: isFeatured,
                is_active: true,
                created_at: Timestamp.now(),
                image_url: finalImageUrl
            })
            setSuccess(true)
            toast.success('Product completely saved to Firestore!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Published!</h2>
                <p className="text-slate-500 mb-8 text-center max-w-md">Your new product is now live on the storefront and available for customers to purchase.</p>
                <div className="flex gap-4">
                    <Link href="/admin/products" className="btn-outline px-6 bg-white">Back to Products</Link>
                    <button onClick={() => setSuccess(false)} className="btn-primary px-6 shadow-sm">Add Another</button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
                    <p className="text-sm text-slate-500">Create a new item in your catalog</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Details (Left 2 cols) */}
                <div className="md:col-span-2 space-y-6">

                    {/* General Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-900 mb-4">General Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Farm Fresh Organic Tomatoes"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the product, source, and quality..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-900 mb-4">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-bold text-slate-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                                    <span>MRP (₹)</span>
                                    {discountPercent > 0 && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{discountPercent}% OFF</span>}
                                </label>
                                <input
                                    type="number"
                                    value={mrp}
                                    onChange={(e) => setMrp(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 mt-2">Available Stock</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 mt-2">Unit</label>
                                <input
                                    type="text"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="e.g. 1 kg, 500 g, 1 pc"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Right col) */}
                <div className="space-y-6">

                    {/* Organization */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-900 mb-4">Organization</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-slate-300"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">Mark as Featured</label>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-900 mb-4">Product Image</h2>

                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`
                                border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
                                ${imagePreview ? 'border-primary-500 bg-primary-50/10' : 'border-slate-200 hover:bg-slate-50 hover:border-primary-300'}
                            `}>
                                {imagePreview ? (
                                    <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-lg overflow-hidden mb-3">
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="text-white" size={24} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:text-primary-500 rounded-full flex items-center justify-center mb-3 transition-colors">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <p className="text-sm font-medium text-slate-700">
                                    {imagePreview ? 'Change Image' : 'Click to upload image'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        {loading && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    <span>Uploading...</span>
                                    <span>{Math.round(uploadProgress)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Action Bar */}
                <div className="md:col-span-3 flex justify-end gap-4 pt-4 border-t border-slate-200">
                    <Link href="/admin/products" className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors bg-white">
                        Discard
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Publishing...'}
                            </>
                        ) : 'Publish Product'}
                    </button>
                </div>
            </form>

        </div>
    )
}
