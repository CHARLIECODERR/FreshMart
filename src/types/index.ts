// Core TypeScript types for FreshMart PWA

export interface Address {
    id: string;
    label: string; // e.g., 'Home', 'Work', 'Office'
    full_name: string;
    phone: string;
    email: string;
    address_line: string;
    city: string;
    pincode: string;
    is_default?: boolean;
}

export interface UserProfile {
    id: string;
    uid: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    role: 'customer' | 'admin';
    addresses: Address[];
    created_at: string;
}

export interface Profile {
    id: string
    full_name: string | null
    phone: string | null
    avatar_url: string | null
    created_at: string
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    item_count?: number;
    is_active?: boolean;
}

export interface ProductImage {
    id: string
    product_id: string
    url: string
    display_order: number
    is_primary: boolean
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    sale_price?: number;
    image_url?: string;
    category_id: string;
    unit: string;
    stock?: number;
    stock_qty: number;
    mrp: number;
    is_active: boolean;
    is_featured?: boolean;
    created_at?: string;
    // joined
    category?: Category
    images?: ProductImage[]
}

export interface Banner {
    id: string
    title: string | null
    subtitle: string | null
    image_url: string
    link_url: string | null
    display_order: number
    is_active: boolean
}

// Addresses and Cart items follow

export interface CartItem {
    id: string
    product_id: string
    quantity: number
    product?: Product
}

// LOCAL cart item (before syncing to DB)
export interface LocalCartItem {
    product_id: string
    quantity: number
    product: Product
}

export interface WishlistItem {
    id: string
    user_id: string
    product_id: string
    product?: Product
}

export interface Coupon {
    id: string
    code: string
    discount_type: 'percent' | 'flat'
    discount_value: number
    min_order_value: number
    max_uses: number | null
    used_count: number
    valid_from: string | null
    valid_until: string | null
    is_active: boolean
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'online' | 'razorpay'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
    id: string
    user_id: string
    status: OrderStatus
    address_snapshot: Address
    subtotal: number
    delivery_fee: number
    discount: number
    total: number
    coupon_code: string | null
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    notes: string | null
    created_at: string
    updated_at: string
    // joined
    items?: OrderItem[]
    events?: OrderEvent[]
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string | null
    product_snapshot: {
        name: string
        image_url: string | null
        unit: string
        price: number
    }
    quantity: number
    unit_price: number
}

export interface OrderEvent {
    id: string
    order_id: string
    status: OrderStatus
    note: string | null
    created_at: string
}

// Payment service abstraction
export interface PaymentResult {
    success: boolean
    transaction_id?: string
    error?: string
}

// Cart store type
export interface CartStore {
    items: LocalCartItem[]
    addItem: (product: Product, qty?: number) => void
    removeItem: (productId: string) => void
    updateQty: (productId: string, qty: number) => void
    clearCart: () => void
    total: () => number
    itemCount: () => number
    getQty: (productId: string) => number
}

// Wishlist store
export interface WishlistStore {
    productIds: string[]
    toggle: (productId: string) => void
    has: (productId: string) => boolean
    setFromDB: (ids: string[]) => void
}

// Checkout form
export interface CheckoutForm {
    address_id: string
    payment_method: PaymentMethod
    coupon_code: string
    notes: string
}

// Filters
export interface ProductFilters {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest'
    search?: string
}
