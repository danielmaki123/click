import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface CartStore {
  carts: Record<string, CartItem[]>
  addItem: (slug: string, item: CartItem) => void
  removeItem: (slug: string, menuItemId: string) => void
  updateQuantity: (slug: string, menuItemId: string, quantity: number) => void
  clearCart: (slug: string) => void
  getCartTotal: (slug: string) => number
  getItemQuantity: (slug: string, menuItemId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: {},
      addItem: (slug, newItem) => {
        const carts = get().carts
        const slugCart = carts[slug] || []
        const existingItem = slugCart.find((i) => i.menuItemId === newItem.menuItemId)
        
        let newCart
        if (existingItem) {
          newCart = slugCart.map((i) =>
            i.menuItemId === newItem.menuItemId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          )
        } else {
          newCart = [...slugCart, newItem]
        }
        
        set({ carts: { ...carts, [slug]: newCart } })
      },
      removeItem: (slug, menuItemId) => {
        const carts = get().carts
        const slugCart = carts[slug] || []
        set({
          carts: {
            ...carts,
            [slug]: slugCart.filter((i) => i.menuItemId !== menuItemId),
          },
        })
      },
      updateQuantity: (slug, menuItemId, quantity) => {
        const carts = get().carts
        const slugCart = carts[slug] || []
        
        if (quantity <= 0) {
          const newSlugCart = slugCart.filter((i) => i.menuItemId !== menuItemId)
          set({
            carts: {
              ...carts,
              [slug]: newSlugCart,
            },
          })
          return
        }

        set({
          carts: {
            ...carts,
            [slug]: slugCart.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            ),
          },
        })
      },
      clearCart: (slug) => {
        const carts = get().carts
        set({ carts: { ...carts, [slug]: [] } })
      },
      getCartTotal: (slug) => {
        const slugCart = get().carts[slug] || []
        return slugCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },
      getItemQuantity: (slug, menuItemId) => {
        const slugCart = get().carts[slug] || []
        return slugCart.find((i) => i.menuItemId === menuItemId)?.quantity || 0
      },
    }),
    {
      name: 'click-carts',
    }
  )
)
