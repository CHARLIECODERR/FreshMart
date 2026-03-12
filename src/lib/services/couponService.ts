import { db } from '../firebase/config'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { Coupon } from '@/types'

const COLLECTION_NAME = 'coupons'

export const couponService = {
    async getCoupons() {
        const q = query(collection(db, COLLECTION_NAME), orderBy('created_at', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Coupon[]
    },

    async getActiveCoupons() {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('is_active', '==', true),
            orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Coupon[]
    },

    async addCoupon(couponData: Omit<Coupon, 'id' | 'used_count'>) {
        return await addDoc(collection(db, COLLECTION_NAME), {
            ...couponData,
            used_count: 0,
            created_at: Timestamp.now().toDate().toISOString()
        })
    },

    async toggleStatus(id: string, currentStatus: boolean) {
        const couponRef = doc(db, COLLECTION_NAME, id)
        return await updateDoc(couponRef, { is_active: !currentStatus })
    },

    async deleteCoupon(id: string) {
        return await deleteDoc(doc(db, COLLECTION_NAME, id))
    }
}
