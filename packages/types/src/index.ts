import { z } from 'zod';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  whatsapp: string;
  isOpen: boolean;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  price: string; // Decimal as string for JSON
  isAvailable: boolean;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  total: string;
  whatsappSummary?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId?: string | null;
  itemName: string;
  itemPrice: string;
  quantity: number;
  notes?: string | null;
}

export interface MenuResponse {
  restaurant: {
    name: string;
    whatsapp: string;
    currency: string;
  };
  categories: (Category & {
    items: MenuItem[];
  })[];
}

// Supervisor Contract: POST /api/r/:slug/orders
export const CreateOrderSchema = z.object({
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(8).max(20),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().min(1).max(20),
    notes: z.string().max(200).optional(),
  })).min(1),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;
