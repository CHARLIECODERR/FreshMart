import { Product } from '@/types'
import { useCartStore } from '@/contexts/useCartStore'
import { useWishlistStore } from '@/contexts/useWishlistStore'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Heart } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
    product: Product
    priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const { toggle: toggleWishlist, has: isWishlisted } = useWishlistStore()
    const addItem = useCartStore((state) => state.addItem)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQty = useCartStore((state) => state.updateQty)
    const qtyInCart = useCartStore((state) => state.getQty(product.id))

    const wishlisted = isWishlisted(product.id)

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        toggleWishlist(product.id)
        if (!wishlisted) {
            toast.success('Added to Wishlist')
        }
    }

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem(product, 1)
        toast.success('Added to Cart')
    }

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault()
        if (qtyInCart < product.stock_qty) {
            updateQty(product.id, qtyInCart + 1)
        } else {
            toast.error('Max stock limit reached')
        }
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        if (qtyInCart === 1) {
            removeItem(product.id)
            toast.success('Removed from Cart')
        } else {
            updateQty(product.id, qtyInCart - 1)
        }
    }

    const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'
    const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

    return (
        <Link
            href={`/product/${product.slug}`}
            className="card-premium flex flex-col relative w-full overflow-hidden group h-full"
        >
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {discountPercent > 0 && (
                    <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {discountPercent}% OFF
                    </span>
                )}
                {product.stock_qty <= 5 && product.stock_qty > 0 && (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm w-fit">
                        Only {product.stock_qty} left
                    </span>
                )}
            </div>

            <button
                onClick={handleWishlist}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all"
                aria-label="Wishlist"
            >
                <Heart
                    size={16}
                    className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
            </button>

            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full bg-gray-50 flex-shrink-0 flex items-center justify-center pt-2">
                <div className="relative w-[80%] h-[80%]">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={priority}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1 pb-16">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base leading-tight line-clamp-2 md:h-11">
                    {product.name}
                </h4>
                <span className="text-xs text-gray-500 mt-1">{product.unit}</span>

                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-gray-900 md:text-lg">₹{product.price}</span>
                    {product.mrp && product.price < product.mrp && (
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                </div>
            </div>

            {/* Fixed Bottom Action */}
            <div className="absolute bottom-3 left-3 right-3">
                {product.stock_qty === 0 ? (
                    <button disabled className="w-full bg-gray-100 text-gray-400 text-sm font-semibold py-2 rounded-xl border border-gray-200 cursor-not-allowed">
                        Out of Stock
                    </button>
                ) : qtyInCart === 0 ? (
                    <button
                        onClick={handleAdd}
                        className="w-full btn-outline border-primary-100 bg-primary-50 py-1.5 md:py-2 text-primary-700 active:bg-primary-100"
                    >
                        Add
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-between bg-primary-600 text-white rounded-xl overflow-hidden shadow-sm h-9 md:h-10">
                        <button
                            onClick={handleDecrement}
                            className="px-3 h-full hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center justify-center"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-bold text-sm w-8 text-center">{qtyInCart}</span>
                        <button
                            onClick={handleIncrement}
                            className="px-3 h-full hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center justify-center"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </div>
        </Link>
    )
}
