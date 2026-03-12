import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Banner } from '@/types'

const COLLECTION_NAME = 'banners'

export const getBanners = async (onlyActive = true): Promise<Banner[]> => {
    try {
        let q = query(collection(db, COLLECTION_NAME), orderBy('display_order', 'asc'))

        if (onlyActive) {
            q = query(q, where('is_active', '==', true))
        }

        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Banner[]
    } catch (error) {
        console.error('Error fetching banners:', error)
        return []
    }
}

export const createBanner = async (data: Omit<Banner, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data)
    return docRef.id
}

export const updateBanner = async (id: string, data: Partial<Banner>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, data)
}

export const deleteBanner = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
}
