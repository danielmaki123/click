// apps/web/src/app/r/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { MenuClient } from '@/components/menu-client';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string | null;
}

interface Category {
  name: string;
  items: MenuItem[];
}

interface MenuData {
  restaurant: {
    name: string;
    whatsapp: string;
    currency: string;
    isOpen?: boolean;
  };
  categories: Category[];
}

async function getMenu(slug: string): Promise<MenuData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/api/r/${slug}/menu`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    return null;
  }
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMenu(slug);

  if (!data) {
    notFound();
  }

  const { restaurant, categories } = data;

  if (restaurant.isOpen === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
        <div className="p-4 bg-orange-100 text-orange-800 rounded-lg shadow-sm border border-orange-200">
          <p className="font-semibold text-lg">Cerrado actualmente</p>
          <p className="text-sm opacity-90">Vuelve pronto para realizar tu pedido.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{restaurant.name}</h1>
            <p className="text-[10px] text-green-600 font-bold flex items-center uppercase tracking-wider mt-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Abierto ahora
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter block mb-0.5">Moneda</span>
            <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-sm">{restaurant.currency}</span>
          </div>
        </div>
      </header>

      {/* Client Menu logic */}
      <MenuClient 
        slug={slug} 
        restaurant={restaurant} 
        categories={categories} 
      />
    </main>
  );
}
