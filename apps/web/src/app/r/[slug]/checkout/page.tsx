'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  
  const { carts, getCartTotal, clearCart } = useCartStore()
  
  const [isHydrated, setIsHydrated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
  })

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const currentCart = isHydrated ? (carts[slug] || []) : []
  const cartTotal = isHydrated ? getCartTotal(slug) : 0

  if (!isHydrated) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-orange-600" size={40} />
    </div>
  )

  if (currentCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full font-sans">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrito vacío</h1>
            <p className="text-gray-500 mb-6">Aún no has agregado productos a tu pedido.</p>
            <button 
            onClick={() => router.push(`/r/${slug}`)}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-orange-700 transition-all"
            >
            Explorar menú
            </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    try {
      const res = await fetch(`${apiUrl}/api/r/${slug}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          items: currentCart.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear el pedido. Revisa los datos.')
      }

      // Success
      clearCart(slug)
      router.push(`/r/${slug}/order-success?orderNumber=${data.orderNumber}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Tu Pedido</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        {/* Order Summary */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Resumen de productos</h2>
          <div className="space-y-4">
            {currentCart.map((item) => (
              <div key={item.menuItemId} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">
                    <span className="text-orange-600 mr-2">{item.quantity}x</span>
                    {item.name}
                  </p>
                  {item.notes && <p className="text-xs text-gray-500 mt-1 italic">"{item.notes}"</p>}
                </div>
                <p className="font-bold text-gray-700">
                  ${ (item.price * item.quantity).toFixed(2) }
                </p>
              </div>
            ))}
            <div className="pt-4 border-t flex justify-between items-center">
              <p className="font-bold text-gray-900 text-lg">Subtotal</p>
              <p className="font-extrabold text-gray-900 text-xl">${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Tus Datos</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-black text-gray-500 uppercase mb-2">Nombre completo</label>
              <input 
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ej: Mateo Messi"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-medium"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-black text-gray-500 uppercase mb-2">Teléfono / WhatsApp</label>
              <input 
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Ej: +54 9 11 ..."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 font-medium"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium animate-pulse">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-orange-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all mt-6 uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Confirmar Pedido
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-4 px-4 leading-relaxed font-medium">
              Al confirmar, tu pedido será enviado directamente al restaurante para su preparación.
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
