'use client'

import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { CheckCircle, Home, MessageSquare, Loader2, PartyPopper } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

interface RestaurantInfo {
  name: string
  whatsapp: string
}

function OrderSuccessContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const orderNumber = searchParams ? searchParams.get('orderNumber') : '...'
  
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>('PENDING')
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    async function fetchRestaurant() {
      if (!slug) return
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const res = await fetch(`${apiUrl}/api/r/${slug}/menu`)
        if (res.ok) {
          const data = await res.json()
          setRestaurant(data.restaurant)
        }
      } catch (err) {
        console.error('Error fetching restaurant info:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurant()
  }, [slug])

  // Polling for Order Status (Phase 3 - Step 5)
  useEffect(() => {
    if (!slug || !orderNumber || orderNumber === '...' || isPaused) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    const checkStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/r/${slug}/orders/${orderNumber}`)
        if (res.ok) {
          const order = await res.json()
          setStatus(order.status)
          
          // Stop polling if final state reached
          if (['COMPLETED', 'REJECTED', 'CANCELLED'].includes(order.status)) {
            setIsPaused(true)
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }

    const intervalId = setInterval(checkStatus, 5000)
    checkStatus() // Initial check

    return () => clearInterval(intervalId)
  }, [slug, orderNumber, isPaused])

  const handleWhatsAppClick = () => {
    if (!restaurant?.whatsapp) return
    const message = `¡Hola! Acabo de realizar un pedido (#${orderNumber}) en ${restaurant.name} a través de Click.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${restaurant.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium animate-pulse">Confirmando tu pedido...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-orange-200/50 border border-white/50 max-w-md w-full animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>

        <div className="flex justify-center mb-8 relative">
          <div className="bg-green-500 p-5 rounded-full shadow-lg shadow-green-200 animate-bounce transition-all duration-1000">
            <CheckCircle size={56} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <PartyPopper className="text-orange-400 rotate-12" size={32} />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">¡Genial!</h1>
        <p className="text-gray-500 mb-10 font-medium px-4 leading-relaxed">
          Tu pedido en <span className="text-gray-900 font-bold">{restaurant?.name || 'el restaurante'}</span> ha sido recibido con éxito.
        </p>

        <div className="bg-gray-50 rounded-3xl p-8 mb-6 border-2 border-dashed border-gray-200 relative group transition-all hover:bg-orange-50/30 hover:border-orange-200">
          <p className="text-[11px] font-black text-orange-400 uppercase tracking-[0.25em] mb-2">Ticket de seguimiento</p>
          <p className="text-5xl font-black text-gray-900 drop-shadow-sm font-mono">#{orderNumber}</p>
        </div>

        {/* Status Tracker (Phase 3 - Step 5) */}
        <div className="mb-10 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado del pedido</span>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full border-2 ${
              status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
              status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
              'bg-orange-100 text-orange-700 border-orange-200 animate-pulse'
            }`}>
              {status === 'PENDING' && '⏳ RECIBIDO'}
              {status === 'ACCEPTED' && '👨‍🍳 EN COCINA'}
              {status === 'READY' && '🥡 PRODUCTO LISTO'}
              {status === 'COMPLETED' && '✅ ENTREGADO'}
              {status === 'REJECTED' && '❌ RECHAZADO'}
            </span>
          </div>
          
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex gap-1 p-1 border border-gray-200/50 shadow-inner">
            <div className={`h-full rounded-full transition-all duration-1000 ${
              status === 'REJECTED' ? 'bg-red-500 w-full' :
              status === 'PENDING' ? 'bg-orange-400 w-1/4' :
              status === 'ACCEPTED' ? 'bg-orange-500 w-1/2' :
              status === 'READY' ? 'bg-orange-600 w-3/4' :
              'bg-green-500 w-full'
            }`}></div>
          </div>
          
          <p className="text-xs text-gray-400 mt-3 italic font-medium">
            {status === 'PENDING' && 'Esperando confirmación del restaurante...'}
            {status === 'ACCEPTED' && '¡El chef ya está preparando tu comida!'}
            {status === 'READY' && 'Tu pedido está listo para ser retirado.'}
            {status === 'COMPLETED' && '¡Gracias por tu compra! Esperamos verte pronto.'}
            {status === 'REJECTED' && 'Lo sentimos, el restaurante no puede procesar tu pedido.'}
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
            WhatsApp de {restaurant?.name || 'Contacto'}
          </button>
          
          <button 
            onClick={() => router.push(`/r/${slug}`)}
            className="w-full bg-white text-gray-700 border-2 border-gray-100 py-5 rounded-2xl font-bold hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Home size={22} className="text-orange-500" />
            Volver al Menú
          </button>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-2">
        <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
          Gracias por pedir con <span className="font-black text-orange-600 tracking-tighter text-lg italic">CLICK</span>
        </p>
        <div className="h-1 w-8 bg-orange-200 rounded-full"></div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
