'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'

interface MenuItem {
  id: string
  name: string
  price: string
  description?: string | null
}

interface Category {
  name: string
  items: MenuItem[]
}

interface MenuClientProps {
  slug: string
  restaurant: {
    name: string
    currency: string
  }
  categories: Category[]
}

export function MenuClient({ slug, restaurant, categories }: MenuClientProps) {
  const { addItem, updateQuantity, getItemQuantity, getCartTotal, carts } = useCartStore()
  
  // Hydration fix for Zustand persist
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const currentCart = isHydrated ? (carts[slug] || []) : []
  const totalItems = currentCart.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = isHydrated ? getCartTotal(slug) : 0

  if (!isHydrated) {
    return (
      <div className="max-w-md mx-auto px-4 mt-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-24"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-md mx-auto px-4 mt-6">
        {categories.map((category) => (
          <section key={category.name} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 sticky top-16 bg-gray-50 py-2 z-0 uppercase tracking-wider">
              {category.name}
            </h2>
            <div className="space-y-4">
              {category.items.map((item) => {
                const quantity = getItemQuantity(slug, item.id)
                const priceNum = parseFloat(item.price)

                return (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                      )}
                      <p className="text-orange-600 font-bold mt-2">
                        {restaurant.currency} {priceNum.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {quantity > 0 ? (
                        <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(slug, item.id, quantity - 1)}
                            className="h-8 w-8 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(slug, item.id, quantity + 1)}
                            className="h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-orange-600 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addItem(slug, {
                            menuItemId: item.id,
                            name: item.name,
                            price: priceNum,
                            quantity: 1
                          })}
                          className="h-10 w-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                        >
                          <Plus size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 animate-in fade-in slide-in-from-bottom-4 transition-all duration-300">
          <Link 
            href={`/r/${slug}/checkout`}
            className="max-w-md mx-auto bg-orange-600 text-white rounded-2xl p-4 shadow-xl flex items-center justify-between hover:bg-orange-700 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs text-orange-100 font-medium">Ver mi pedido</p>
                <p className="font-bold">Carrito</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-100">Total</p>
              <p className="font-bold text-lg">{restaurant.currency} {cartTotal.toFixed(2)}</p>
            </div>
          </Link>
        </div>
      )}
    </>
  )
}
