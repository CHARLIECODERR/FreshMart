import { db } from '../firebase/config'
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp
} from 'firebase/firestore'
import { Product, Category } from '@/types'

// Categories
export const getCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]
}

// Products
export const getActiveProducts = async () => {
    const q = query(collection(db, 'products'), where('is_active', '==', true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getFeaturedProducts = async () => {
    const q = query(
        collection(db, 'products'),
        where('is_active', '==', true),
        where('is_featured', '==', true)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]
}

export const getProductBySlug = async (slug: string) => {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Product
}

// Admin Product Actions
export const addProduct = async (productData: any) => {
    return await addDoc(collection(db, 'products'), {
        ...productData,
        created_at: Timestamp.now()
    })
}

export const updateProduct = async (id: string, productData: any) => {
    const docRef = doc(db, 'products', id)
    return await updateDoc(docRef, productData)
}
