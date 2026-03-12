'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/contexts/useCartStore'
import { ChevronDown, MapPin, Check, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { orderService } from '@/lib/services/orderService'
import { v4 as uuidv4 } from 'uuid'
import { Address } from '@/types'

export default function CheckoutPage() {
    const { user, profile, loading, updateAddresses } = useAuth()
    const router = useRouter()
    const cartItems = useCartStore(state => state.items)
    const cartTotal = useCartStore(state => state.total())
    const clearCart = useCartStore(state => state.clearCart)

    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    const addresses = profile?.addresses || []

    // Pre-select default address
    React.useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const def = addresses.find(a => a.is_default) || addresses[0]
            setSelectedAddressId(def.id)
        }
    }, [addresses, selectedAddressId])

    // Redirect if guest or empty cart
    React.useEffect(() => {
        if (!loading && !user) router.push('/login?redirect=/checkout')
        if (cartItems.length === 0 && !orderSuccess) {
            router.push('/cart')
        }
    }, [user, cartItems, router, orderSuccess, loading])

    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    const deliveryFee = cartTotal > 499 ? 0 : 40
    const totalAmount = cartTotal + deliveryFee

    const handlePlaceOrder = async () => {
        if (!user || !profile) return
        if (!selectedAddressId || !selectedAddress) {
            toast.error('Please select a delivery address')
            return
        }

        setPlacingOrder(true)
        try {
            const orderData = {
                user_id: user.uid,
                address_snapshot: selectedAddress,
                items: cartItems.map(item => ({
                    id: uuidv4(),
                    order_id: '', // Will be set by service/DB logic if needed, but snapshot is key
                    product_id: item.product_id,
                    product_snapshot: {
                        name: item.product.name,
                        image_url: item.product.image_url || null,
                        unit: item.product.unit,
                        price: item.product.price
                    },
                    quantity: item.quantity,
                    unit_price: item.product.price
                })),
                subtotal: cartTotal,
                delivery_fee: deliveryFee,
                total: totalAmount,
                discount: 0,
                coupon_code: null,
                payment_method: paymentMethod as any,
                payment_status: 'pending' as any,
                notes: '',
                events: [
                    {
                        id: uuidv4(),
                        order_id: '',
                        status: 'placed' as any,
                        note: 'Order placed successfully',
                        created_at: new Date().toISOString()
                    }
                ]
            }

            const result = await orderService.createOrder(orderData as any)
            if (result.success) {
                setOrderSuccess(true)
                clearCart()
                toast.success('Order placed successfully!')
            }
        } catch (error) {
            toast.error('Failed to place order. Please try again.')
        } finally {
            setPlacingOrder(false)
        }
    }

    const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!profile || !user) return
        if (addresses.length >= 3) {
            toast.error('Maximum 3 addresses allowed')
            return
        }

        setIsSavingAddress(true)
        const formData = new FormData(e.currentTarget)
        const newAddr: Address = {
            id: uuidv4(),
            label: formData.get('label') as string,
            full_name: formData.get('full_name') as string,
            phone: formData.get('phone') as string,
            email: profile.email || '',
            address_line: formData.get('address_line') as string,
            city: formData.get('city') as string,
            pincode: formData.get('pincode') as string,
            is_default: addresses.length === 0
        }

        try {
            const updated = [...addresses, newAddr]
            await updateAddresses(updated)
            setSelectedAddressId(newAddr.id)
            setShowAddressModal(false)
            toast.success('Address added!')
        } catch (err) {
            toast.error('Failed to save address')
        } finally {
            setIsSavingAddress(false)
        }
    }

    if (loading) return <div className="min-h-screen bg-background pt-20 px-6 text-center">Loading checkout...</div>

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-10 text-center border border-gray-100 animate-scale-in">
                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="stroke-[3]" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 text-sm mb-8 px-4">
                        Thank you for shopping with FreshMart. Your order has been placed successfully.
                    </p>

                    <div className="space-y-4">
                        <Link href="/account/orders" className="w-full btn-primary block py-3.5 shadow-lg shadow-primary-500/10">
                            Track My Order
                        </Link>
                        <Link href="/" className="w-full text-slate-500 font-bold hover:text-primary-600 transition-colors py-2 block text-sm">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-32 md:pb-12 pt-4 px-4 max-w-5xl mx-auto animate-fade-in">
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-8 px-2 md:px-0">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

                {/* Main Content */}
                <div className="flex-1 space-y-8">

                    {/* Address Section */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">📍</div>
                                Delivery Address
                            </h3>
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="text-primary-600 text-xs font-bold hover:underline bg-primary-50 px-3 py-1.5 rounded-full"
                            >
                                Add New Address
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                                <p className="text-slate-500 text-sm mb-4 font-medium">No saved addresses found.</p>
                                <Link href="/account/addresses" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                                    <Plus size={16} /> Add Address
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {addresses.map(addr => (
                                    <label
                                        key={addr.id}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${selectedAddressId === addr.id
                                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/10 shadow-sm'
                                            : 'border-slate-100 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr.id}
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                            className="mt-1 peer sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedAddressId === addr.id ? 'border-primary-500' : 'border-slate-200'}`}>
                                            {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="font-bold text-gray-900 text-sm">{addr.full_name}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">{addr.label}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed truncate">
                                                {addr.address_line}, {addr.city}, {addr.pincode}
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">📞 {addr.phone}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">💳</div>
                            Payment Method
                        </h3>

                        <div className="grid gap-4">
                            {[
                                { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: '📱' },
                                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                            ].map(method => (
                                <label
                                    key={method.id}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === method.id
                                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/10 shadow-sm'
                                        : 'border-slate-100 hover:border-slate-300 bg-white'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0">
                                        {method.icon}
                                    </div>
                                    <span className={`font-bold text-sm flex-1 ${paymentMethod === method.id ? 'text-primary-700' : 'text-slate-600'}`}>
                                        {method.label}
                                    </span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-primary-500' : 'border-slate-200'}`}>
                                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
                        <h3 className="font-bold text-xl text-gray-900 mb-6 underline decoration-primary-500/30 underline-offset-8">Order Summary</h3>

                        <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto no-scrollbar pr-1">
                            {cartItems.map(item => (
                                <div key={item.product_id} className="flex justify-between items-start group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-primary-600 transition-colors">
                                            {item.product.name}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">₹{item.product.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="text-slate-900 font-bold">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Delivery Fee</span>
                                <span className={deliveryFee === 0 ? 'text-primary-600 font-bold' : 'text-slate-900 font-bold'}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                                <span className="text-slate-900 font-bold">Total Amount</span>
                                <span className="text-2xl font-display font-black text-primary-600 tracking-tight">₹{totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                            className="w-full btn-primary py-4 mt-8 rounded-2xl shadow-xl shadow-primary-500/20 text-base flex items-center justify-center font-bold gap-3 group overflow-hidden relative"
                        >
                            {placingOrder ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Place Order</span>
                                    <ChevronDown size={20} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-slate-400 text-center mt-4 font-medium px-4">
                            By placing the order, you agree to FreshMart's <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar (Alternative for better UX) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 z-40 lg:hidden flex items-center justify-between pb-safe">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total to Pay</p>
                    <p className="text-2xl font-display font-black text-slate-900 leading-none">₹{totalAmount}</p>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="btn-primary px-8 py-3.5 shadow-lg shadow-primary-500/20 text-sm font-bold flex items-center gap-2"
                >
                    {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
            </div>
            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-scale-in relative">
                        <button
                            onClick={() => setShowAddressModal(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <X size={20} />
                        </button>

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
                                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSavingAddress}
                                    className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50"
                                >
                                    {isSavingAddress ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
