import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db, Prisma } from '@local/database';
import { CreateOrderSchema } from '@local/types';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/r/:slug/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    
    // 1. Validate Input
    const parseResult = CreateOrderSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid order data',
        details: parseResult.error.format()
      });
    }

    const { customerName, customerPhone, items } = parseResult.data;

    try {
      // 2. Find Restaurant and Create Order in Transaction
      const result = await db.$transaction(async (tx) => {
        // 1. Validar existencia del restaurante
        const restaurant = await tx.restaurant.findUnique({
          where: { slug }
        });

        if (!restaurant) {
          const error: any = new Error('Restaurant not found');
          error.statusCode = 404;
          throw error;
        }

        if (!restaurant.isOpen) {
          const error: any = new Error('Restaurant is currently closed');
          error.statusCode = 409;
          throw error;
        }

        // 2. Validar ítems (pertenencia y disponibilidad)
        const menuItemIds = [...new Set(items.map((i) => i.menuItemId))];
        const dbItems = await tx.menuItem.findMany({
          where: {
            id: { in: menuItemIds },
            restaurantId: restaurant.id
          }
        });

        if (dbItems.length !== menuItemIds.length) {
          const error: any = new Error('Some items do not belong to this restaurant or do not exist');
          error.statusCode = 422;
          throw error;
        }

        const unavailableItems = dbItems.filter(i => !i.isAvailable);
        if (unavailableItems.length > 0) {
          const error: any = new Error('Some items are currently not available');
          error.statusCode = 409;
          throw error;
        }

        // 3. Calcular Total en el servidor para evitar fraudes
        let total = new Prisma.Decimal(0);
        const itemsToCreate = items.map((item) => {
          const dbItem = dbItems.find(dbi => dbi.id === item.menuItemId)!;
          const itemTotal = dbItem.price.mul(item.quantity);
          total = total.add(itemTotal);

          return {
            menuItemId: item.menuItemId,
            itemName: dbItem.name,
            itemPrice: dbItem.price,
            quantity: item.quantity,
            notes: item.notes ?? null,
          };
        });

        // 4. Calcular orderNumber (max + 1) por restaurante
        const lastOrder = await tx.order.aggregate({
          where: { restaurantId: restaurant.id },
          _max: { orderNumber: true }
        });
        const orderNumber = (lastOrder._max.orderNumber ?? 0) + 1;

        // 5. Crear Orden e Items
        const order = await tx.order.create({
          data: {
            restaurantId: restaurant.id,
            orderNumber,
            customerName,
            customerPhone,
            total,
            status: 'PENDING',
            items: {
              create: itemsToCreate
            }
          },
          include: {
            items: true
          }
        });

        return { order, currency: restaurant.currency };
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      });

      const { order, currency } = result;
      const whatsappSummary = formatOrderForWhatsApp(order, currency);

      return reply.code(201).send({
        ...order,
        whatsappSummary
      });

    } catch (error: any) {
      // Manejo de colisión de concurrencia (Prisma P2002)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return reply.code(409).send({
          error: 'Concurrency conflict. Please try again.',
          message: 'Target order number is already taken.',
          statusCode: 409
        });
      }

      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      
      return reply.code(statusCode).send({ 
        error: message,
        statusCode 
      });
    }
  });
  
  // 6. Get Order Status for Polling (Phase 3 - Step 5)
  fastify.get('/r/:slug/orders/:orderNumber', async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug, orderNumber } = request.params as { slug: string, orderNumber: string };
    
    try {
      const restaurant = await db.restaurant.findUnique({
        where: { slug },
        select: { id: true, currency: true }
      });

      if (!restaurant) {
        return reply.code(404).send({ error: 'Restaurant not found' });
      }

      const order = await db.order.findUnique({
        where: {
          restaurantId_orderNumber: {
            restaurantId: restaurant.id,
            orderNumber: parseInt(orderNumber)
          }
        },
        include: {
          items: true
        }
      });

      if (!order) {
        return reply.code(404).send({ error: 'Order not found' });
      }

      return reply.code(200).send(order);

    } catch (error) {
      console.error('Fetch order error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}

function formatOrderForWhatsApp(order: any, currency: string) {
  const itemsList = order.items
    .map((item: any) => `- ${item.quantity}x ${item.itemName} (${currency} ${item.itemPrice})`)
    .join('\n');

  return `🔔 *NUEVO PEDIDO #${order.orderNumber}* 🔔
----------------------------
👤 *Cliente:* ${order.customerName}
📞 *Teléfono:* ${order.customerPhone}
----------------------------
🛒 *DETALLE:*
${itemsList}
----------------------------
💰 *TOTAL: ${currency} ${order.total}*
----------------------------
Acciones recomendadas:
✅ ACEPTAR | ❌ RECHAZAR`.trim();
}
