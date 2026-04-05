// apps/api/src/routes/menu.ts
import type { FastifyInstance } from 'fastify';
import { db } from '@local/database';
import type { Prisma } from '@local/database';
import { z } from 'zod';

type RestaurantWithMenu = Prisma.RestaurantGetPayload<{
  include: {
    categories: {
      include: {
        items: true;
      };
    };
  };
}>;

export async function menuRoutes(server: FastifyInstance) {
  server.get<{ Params: { slug: string } }>(
    '/r/:slug/menu',
    async (request, reply) => {
      const { slug } = request.params;

      const restaurant = await db.restaurant.findFirst({
        where: {
          slug: {
            equals: slug,
            mode: 'insensitive',
          },
        },
        include: {
          categories: {
            orderBy: {
              sortOrder: 'asc',
            },
            include: {
              items: {
                where: {
                  isAvailable: true,
                },
              },
            },
          },
        },
      });

      if (!restaurant) {
        return reply.status(404).send({ error: 'Restaurant not found' });
      }

      if (!restaurant.isOpen) {
        return reply.status(200).send({
          restaurant: {
            name: restaurant.name,
            whatsapp: restaurant.whatsapp,
            currency: restaurant.currency,
            isOpen: false,
          },
          categories: [],
          message: 'Restaurante cerrado actualmente',
        });
      }

      // Format response exactly as requested
      const response = {
        restaurant: {
          name: restaurant.name,
          whatsapp: restaurant.whatsapp,
          currency: restaurant.currency,
        },
        categories: ((restaurant as RestaurantWithMenu).categories || []).map((cat: RestaurantWithMenu['categories'][number]) => ({
          name: cat.name,
          items: (cat.items || [])
            .map((item: RestaurantWithMenu['categories'][number]['items'][number]) => ({
              id: item.id,
              name: item.name,
              price: item.price ? Number(item.price) : 0,
              description: item.description,
            })),
        })),
      };

      return response;
    }
  );
}
