import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistStore } from '@/types'

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            productIds: [],

            toggle: (productId: string) => {
                set((state) => {
                    const exists = state.productIds.includes(productId)
                    return {
                        productIds: exists
                            ? state.productIds.filter((id) => id !== productId)
                            : [...state.productIds, productId]
                    }
                })
            },

            has: (productId: string) => {
                return get().productIds.includes(productId)
            },

            setFromDB: (ids: string[]) => {
                set({ productIds: ids })
            }
        }),
        {
            name: 'freshmart-wishlist',
        }
    )
)
