import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartStore, Product } from '@/types'

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: Product, qty: number = 1) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product_id === product.id)
                    const currentQty = existingItem ? existingItem.quantity : 0
                    const newQty = Math.min(product.stock_qty, currentQty + qty)

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product_id === product.id
                                    ? { ...item, quantity: newQty }
                                    : item
                            ),
                        }
                    }

                    return {
                        items: [...state.items, { product_id: product.id, quantity: newQty, product }],
                    }
                })
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product_id !== productId),
                }))
            },

            updateQty: (productId: string, qty: number) => {
                set((state) => {
                    const item = state.items.find(i => i.product_id === productId)
                    if (!item) return state

                    const maxStock = item.product.stock_qty
                    const newQty = Math.max(1, Math.min(maxStock, qty))

                    return {
                        items: state.items.map((i) =>
                            i.product_id === productId ? { ...i, quantity: newQty } : i
                        ),
                    }
                })
            },

            clearCart: () => set({ items: [] }),

            total: () => {
                return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            },

            itemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0)
            },

            getQty: (productId: string) => {
                const item = get().items.find((item) => item.product_id === productId)
                return item ? item.quantity : 0
            },
        }),
        {
            name: 'freshmart-cart',
        }
    )
)
