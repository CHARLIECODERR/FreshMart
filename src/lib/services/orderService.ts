import { db } from '@/lib/firebase/config'
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'
import { Order, OrderStatus } from '@/types'

export const orderService = {
    // Create a new order
    async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
        try {
            const orderRef = collection(db, 'orders')
            const newOrder = {
                ...orderData,
                status: 'placed' as OrderStatus,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            }
            const docRef = await addDoc(orderRef, newOrder)
            return { id: docRef.id, success: true }
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },

    // Get orders for a specific user
    async getUserOrders(userId: string) {
        try {
            const q = query(
                collection(db, 'orders'),
                where('user_id', '==', userId),
                orderBy('created_at', 'desc')
            )
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Timestamps to ISO strings for serializability if needed
                created_at: doc.data().created_at?.toDate().toISOString(),
                updated_at: doc.data().updated_at?.toDate().toISOString()
            })) as Order[]
        } catch (error) {
            console.error('Error fetching user orders:', error)
            return []
        }
    },

    // Get order details by ID
    async getOrderById(orderId: string) {
        try {
            const docRef = doc(db, 'orders', orderId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                return {
                    id: docSnap.id,
                    ...data,
                    created_at: data.created_at?.toDate().toISOString(),
                    updated_at: data.updated_at?.toDate().toISOString()
                } as Order
            }
            return null
        } catch (error) {
            console.error('Error fetching order:', error)
            return null
        }
    },

    // Update order status (Admin)
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        try {
            const docRef = doc(db, 'orders', orderId)
            await updateDoc(docRef, {
                status,
                updated_at: serverTimestamp()
            })
            return true
        } catch (error) {
            console.error('Error updating order status:', error)
            return false
        }
    }
}
